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
        url: data.queue[0].external_urls.spotify
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
        <div className="rounded-lg backdrop-blur-sm p-2 relative bg-[#ffffff10] min-w-[125px] max-w-[300px]">
          <div className="flex">
            <div className="text-center mr-3 shrink-0">
              <img
                src={currentTrack.image}
                alt="album cover"
                className="rounded-md w-[70px]"
                rel="preload"
              />
            </div>
            <div className='max-w-[200px]'>
              <a
                className="text-lg hover:underline block w-fit leading-none text-ellipsis whitespace-nowrap overflow-hidden leading max-w-[200px]"
                href={currentTrack.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className='text-ellipsis whitespace-nowrap overflow-hidden leading-relaxed max-w-[240px]'>{currentTrack.name}</p>
              </a>
              <p className="text-gray-400 text-[15px] leading-none text-sm">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      ) : ""}
      <div className='px-2 py-1'>
        {queueData && currentTrack && currentTrack.isPlaying && currentTrack.name !== queueData.name && (
          <div><a href={queueData.url}><p className='max-w-[250px] text-ellipsis whitespace-nowrap overflow-hidden text-sm'>Next: {queueData.name}</p></a></div>
        )}
      </div>

    </>
  );
}

export default Spotify;
