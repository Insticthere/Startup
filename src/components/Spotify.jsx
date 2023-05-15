import { useEffect, useState } from 'react';
import { getNowPlaying, getQueue } from '../Spotify';

const client_id = import.meta.env.VITE_CLIENTID;
const client_secret = import.meta.env.VITE_CLIENTSEC;
const refresh_token = import.meta.env.VITE_REFRESHTOK;

const basic = btoa(`${client_id}:${client_secret}`);

function Spotify() {
  const [currentQueue, setCurrentQueue] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        let response = await getQueue(basic, refresh_token);
        if (response.ok) {
          let data = await response.text();
          data = JSON.parse(data);
          console.log(data);
          setCurrentQueue({
            name: data.queue[0].name,
            image: data.queue[0].album.images[0].url
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCurrentTrack = async () => {
      try {
        let response = await getNowPlaying(basic, refresh_token);
        if (response.ok) {
          let data = await response.text();
          if (data) {
            data = JSON.parse(data);
            setCurrentTrack({
              name: data.item.name,
              artist: data.item.artists.map((artist) => artist.name).join(", "),
              image: data.item.album.images[0].url,
              url: data.item.external_urls.spotify
            });
            if (data.is_playing && currentTrack.name !== data.item.name) {
              fetchQueue();
            }
          } else {
            setCurrentTrack(null);
          }
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQueue();
    fetchCurrentTrack();
    const intervalId = setInterval(fetchCurrentTrack, 5500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {currentTrack && (
        <div className="rounded-xl backdrop-blur-sm p-2 relative bg-[#ffffff10]">
          <div className="flex justify-center">
            <div className="text-center mr-3 shrink-0">
              <img
                src={currentTrack.image}
                alt="album cover"
                className="rounded-md max-w-[100px] w-[100%] h-auto min-w-[100px]"
                rel="preload"
              />
            </div>
            <div>
              <h3 className="text-[25px] text-black">Spotify</h3>
              <a
                className="text-lg hover:underline block w-fit"
                href={currentTrack.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-black">{currentTrack.name}</p>
              </a>
              <p className="text-gray-400 text-[15px]">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Spotify;