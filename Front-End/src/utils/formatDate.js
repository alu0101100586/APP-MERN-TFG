export function formatDate(dateOnString) {
  const date = new Date(dateOnString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //Formato dd-mm-yyyy
  const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  return formattedDate;
}