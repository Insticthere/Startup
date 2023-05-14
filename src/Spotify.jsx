const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const QUEUE_ENDPOINT = `https://api.spotify.com/v1/me/player/queue`



// This function gets the access token so that we can access the API

const getAccessToken = async (basic, refresh_token) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }).toString(),
  })
  return response.json()
}

// We use the aforementioned access token and send it with the request to the API
// this requests gets the currently playing song.
export const getNowPlaying = async (basic, refresh_token) => {
  const { access_token } = await getAccessToken(basic, refresh_token)
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })}

export const getQueue = async (basic, refresh_token) => {
  const { access_token } = await getAccessToken(basic, refresh_token)
  const response_getTopTracks = await fetch(QUEUE_ENDPOINT, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
  const data = response_getTopTracks
  return data
}