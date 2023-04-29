import React, { useState } from 'react';
import { ArtistMenu } from '../../../components/Authentication/Menu';
import { UserContect } from '../../../components/Authentication/Auth';
import './userArtist.scss';
import { useAuth } from '../../../hooks';

export function UserArtist() {
  const { user } = useAuth();
  const [reload, setReload] = useState(false);

  const onReload = () => setReload((prevState) => !prevState);

  return (
    <div className='user-artist'>
      <div className='user-artist__menu'>
        <ArtistMenu onReload={onReload} reload={reload} user={user} />
      </div>
      <div className='user-artist__content'>
        <UserContect reload={reload} user={user} />
      </div>
    </div>
  )
}
