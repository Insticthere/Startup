async function handleWallpaperChange(url, key) {
    return fetch(url, {
      headers: {
        authorization: `Client-ID ${key}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data = data[0]; // It sends an array
        return {
          image: data.urls.full,
          credit: `${data.user.name}`,
          url: data.links.html,
          alt_description: data.alt_description,
          color: data.color,
          author: data.user.name,
          authorlink: data?.user?.links?.html,
        };
      });
}
  
export default handleWallpaperChange;