import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getNowPlaying, getQueue } from '../api/Spotify';

const client_id = import.meta.env.VITE_CLIENTID;
const client_secret = import.meta.env.VITE_CLIENTSEC;
const refresh_token = import.meta.env.VITE_REFRESHTOK;

const basic = btoa(`${client_id}:${client_secret}`);

function Spotify() {
  const { data: currentTrack, refetch: fetchCurrentTrack } = useQuery('currentTrack', () =>
    getNowPlaying(basic, refresh_token)
      .then((response) => response.json())
      .then((data) => ({
        name: data.item.name,
        artist: data.item.artists.map((artist) => artist.name).join(', '),
        image: data.item.album.images[0].url,
        url: data.item.external_urls.spotify,
        isPlaying: data.is_playing,
      })),
      {
        initialData: {
          name: '',
          artist: '',
          image: '',
          url: '',
          isPlaying: false,
        },
      }
  );

  const { data: queueData, refetch: fetchQueue } = useQuery('queue', () =>
    getQueue(basic, refresh_token)
      .then((data) => ({
        name: data.queue[0].name,
        image: data.queue[0].album.images[0].url,
      }))
      ,
    {
      initialData: {
        name: '',
        image: '',
      },
    }
  );

  useEffect(() => {
    fetchQueue();
    const intervalId = setInterval(() => {
      fetchCurrentTrack();
      if (currentTrack.name === queueData.name && currentTrack.isPlaying) {
        fetchQueue();
      }
    }, 5500);

    return () => clearInterval(intervalId);
  }, [currentTrack, fetchCurrentTrack, fetchQueue, queueData]);
  return (
    <>
      {currentTrack.isPlaying ? (
        <div className="rounded-xl backdrop-blur-sm p-2 relative bg-[#ffffff10]">
          <div className="flex justify-center">
            <div className="text-center mr-3 shrink-0">
              <img
                src={currentTrack.image}
                alt="album cover"
                className="rounded-md max-w-[100px] w-[100%] h-auto min-w-[120px]"
                rel="preload"
              />
            </div>
            <div>
              <h3 className="text-[20px]">Spotify</h3>
              <a
                className="text-lg hover:underline block w-fit"
                href={currentTrack.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p >{currentTrack.name}</p>
              </a>
              <p className="text-gray-400 text-[15px]">{currentTrack.artist}</p>
              {queueData && currentTrack && currentTrack.isPlaying && currentTrack.name !== queueData.name && (
        <div><p className='w-60 ecl'>Next: {queueData.name}</p></div>
      )}
            </div>
          </div>
        </div>
      ) : ""}


    </>
  );
}

export default Spotify;
