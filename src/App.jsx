import Top from './components/Top';
import Spotify from './components/Spotify';
import { useState, useEffect } from "react";
import handleWallpaperChange from './api/wallpaper';

export default function Home() {
  const [wallpaper, setWallpaper] = useState({
    image: "https://images.unsplash.com/photo-1496482475496-a91f31e0386c?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMTI1OHwwfDF8cmFuZG9tfHx8fHx8fHx8MTY4NDE3MDAyN3w&ixlib=rb-4.0.3&q=85",
    credit:  "",
    url:  "",
    alt_description:  "silhouette of stone on seashore during golden hour",
    color:  "rgb(64, 64, 64);",
    author: "Graham Holtshausen",
    authorlink: "https://unsplash.com/@freedomstudios",
  });
  
  useEffect(function () {
    async function fetchData() {
      let data = await handleWallpaperChange(import.meta.env.VITE_URL_S, import.meta.env.VITE_KEY_S);
      setWallpaper(data)
      
    }
    fetchData()
    }, []);

    function handleBgChange() {
      async function fetchData() {
        let data = await handleWallpaperChange(import.meta.env.VITE_URL_S, import.meta.env.VITE_KEY_S);
        setWallpaper(data)
          }
        fetchData()}

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center relative">
    <div className='absolute'><Top /></div>
      <img
        src={wallpaper.image}
        alt={wallpaper.alt_description}
        className="h-screen w-screen object-cover"
        style={{
          backgroundColor: `${wallpaper.color}`,
        }}
        rel="prefetch"
      ></img>
      <div className="absolute max-md:top-0 md:bottom-0 left-0 p-2 text-white">
      <span><a href={wallpaper.authorlink} target="_blank" rel="noopener noreferrer" className='hover:underline'>{wallpaper.author}</a> / <a href='https://unsplash.com/' target="_blank" rel="noopener noreferrer" className='hover:underline'>Unsplash</a></span>
      </div>
      <div className="absolute bottom-0">
        <Spotify />
      </div>
      <div className='right-0 max-md:top-0 md:bottom-0 p-1 absolute flex'>
          <button onClick={() => handleBgChange()}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
      </div>
    </div>
 
  )}