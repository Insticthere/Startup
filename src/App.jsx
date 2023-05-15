import Top from './components/Top';
import Spotify from './components/Spotify';
import { useState, useEffect } from "react";
import handleWallpaperChange from './api/wallpaper';

export default function Home() {
  const [wallpaper, setWallpaper] = useState({image: "",credit: "",url: "",alt_description: "",color: "black"});
  
  useEffect(function () {
    async function fetchData() {
      let data = await handleWallpaperChange(import.meta.env.VITE_URL_S, import.meta.env.VITE_KEY_S);
      setWallpaper(data)
    }
    fetchData()
    }, []);

  return (
    <div className="w-full h-full flex justify-center items-center relative">
    <div className='absolute'><Top /></div>
      <img
        src={wallpaper.image}
        alt={wallpaper.alt_description}
        className="h-screen w-screen object-cover"
        style={{
          backgroundColor: `${wallpaper.color}`,
        }}
      ></img>
      <div className="absolute bottom-0 left-0 p-3 text-white">
      <a href={wallpaper.authorlink} target="_blank" rel="noopener noreferrer" className='hover:underline'><span>{wallpaper.author}, Splash</span></a>
        
      </div>
      <div className="absolute bottom-3">
        <Spotify />
      </div>
    </div>
 
  )}