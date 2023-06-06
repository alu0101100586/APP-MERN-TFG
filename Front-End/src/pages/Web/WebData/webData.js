import React, { useState, useEffect } from 'react'
import { Icon, Image, Statistic } from 'semantic-ui-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { ItemRender } from '../../../components/Web'
import { image } from '../../../assets'
import {
  ArtistService,
  DiscService,
  ConcertService,
  MerchandiseService,
} from '../../../service'
import './webData.scss'

const artistService = new ArtistService()
const discService = new DiscService()
const concertService = new ConcertService()
const merchandiseService = new MerchandiseService()
ChartJS.register(ArcElement, Tooltip, Legend)

export function WebData() {
  const [artists, setArtists] = useState([])
  const [discs, setDiscs] = useState([])
  const [concerts, setConcerts] = useState([])
  const [merchandises, setMerchandises] = useState([])
  const [chartData, setChartData] = useState(null)
  const [bestProject, setBestProject] = useState([])

  useEffect(() => {
    ;(async () => {
      const responseArtists = await artistService.getArtistsApi()
      const responseDiscs = await discService.getDiscsApi()
      const responseConcerts = await concertService.getConcertsApi()
      const responseMerchandises = await merchandiseService.getMerchandisesApi()
      setArtists(responseArtists)
      setDiscs(responseDiscs)
      setConcerts(responseConcerts)
      setMerchandises(responseMerchandises)
    })()
  }, [])

  const getFinishedProjects = () => {
    const projects = [...discs, ...concerts, ...merchandises]
    const finishedProjects = projects.filter(
      (project) => project.moneyLimit <= project.raisedMoney
    )
    return finishedProjects.length
  }

  const getInProgressProjects = () => {
    const currentDate = new Date()
    const inProgressProjects = [...discs, ...concerts, ...merchandises].filter(
      (project) => {
        if (project.releaseDate) {
          const releaseDate = new Date(project.releaseDate)
          return releaseDate > currentDate
        } else if (project.date) {
          const date = new Date(project.date)
          return date > currentDate
        }
        return false
      }
    )
    return inProgressProjects.length
  }

  const getFailedProjects = () => {
    const currentDate = new Date()
    const failedProjects = [...discs, ...concerts, ...merchandises].filter(
      (project) => {
        if (project.releaseDate) {
          const releaseDate = new Date(project.releaseDate)
          return (
            releaseDate < currentDate &&
            project.moneyLimit > project.raisedMoney
          )
        } else if (project.date) {
          const date = new Date(project.date)
          return date < currentDate && project.moneyLimit > project.raisedMoney
        }
        return false
      }
    )
    return failedProjects.length
  }

  const getBestProject = () => {
    const projects = [...discs, ...concerts, ...merchandises]
    if (projects.length === 0) return []
    const bestProject = projects.reduce((prev, current) => {
      return prev.raisedMoney > current.raisedMoney ? prev : current
    })
    let type = ''
    if (discs.includes(bestProject)) {
      type = 'disc'
    } else if (concerts.includes(bestProject)) {
      type = 'concert'
    } else if (merchandises.includes(bestProject)) {
      type = 'merchandise'
    }
    const result = [bestProject, type]
    setBestProject(result)
    return result
  }

  const generatePieChartData = () => {
    const finishedProjects = getFinishedProjects()
    const inProgressProjects = getInProgressProjects()
    const failedProjects = getFailedProjects()

    const data = {
      labels: [
        'Proyectos finalizados',
        'Proyectos en progreso',
        'Proyectos fallidos',
      ],
      datasets: [
        {
          label: 'Proyectos',
          data: [finishedProjects, inProgressProjects, failedProjects],
          backgroundColor: ['#77fffa', '#f2ff00', '#00ff62'],
          hoverBackgroundColor: ['#77fffaa6', '#f2ff00a6', '#00ff62a6'],
        },
      ],
    }

    setChartData(data)
  }

  useEffect(() => {
    getBestProject()

    if (discs && concerts && merchandises) {
      generatePieChartData()
    }
  }, [discs, concerts, merchandises])

  return (
    <div className="web-data-page">
      <div className="web-data-page__title">
        <h1>Estadísticas de CrowdSound</h1>
        <p>
          En esta página se encuentran las estadísticas de la aplicación web
          CrowdSound. En ella podrás ver el numero de artistas, discos,
          conciertos y merchandising que hay en la aplicación, asimismo podrás
          ver el numero de proyectos que hay y el porcentaje de generos
          musicales que marcan tendencia dentro de CrowdSound. Además, podrás
          ver el proyecto con más apoyos y el estado de los proyectos que hay en
          la aplicación.
        </p>
      </div>

      <div className="web-data-page__count">
        <Statistic.Group widths="four">
          <Statistic>
            <Statistic.Value>
              <Icon name="user circle" color="white" />
              {artists.length}
            </Statistic.Value>
            <Statistic.Label>Artistas</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              <Icon name="music" color="white" />
              {discs.length}
            </Statistic.Value>
            <Statistic.Label>Discos</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              <Icon name="ticket" color="white" />
              {concerts.length}
            </Statistic.Value>
            <Statistic.Label>Conciertos</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              <Icon name="shopping cart" color="white" />
              {merchandises.length}
            </Statistic.Value>
            <Statistic.Label>Merchandising</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </div>

      <div className="web-data-page__charts">
        {chartData && <Pie data={chartData} />}
      </div>

      <div className="web-data-page__best-project-suport">
        <h1>
          <Icon name="angle double down" />
          Más apoyado por la comunidad
          <Icon name="angle double down" />
        </h1>
        {bestProject.length > 0 && (
          <ItemRender item={bestProject[0]} type={bestProject[1]} />
        )}
      </div>
    </div>
  )
}
