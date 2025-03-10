import React from "react";
import MovieCard from "../Components/MovieCard";
import movies from '../constants/movies.json';
import QRCard from "../Components/QrCard";


const DiscoverMovies = () => {
  return (
   
    <div>
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Discover Movies</h1>
      <p className="mt-4 text-lg text-gray-600">Find the best movies curated for you!</p>

      <div className="grid grid-cols-5 auto-rows-[400px] gap-2 my-10">
       {
        movies.map((movie,i)=>
        (<div key={i}>
          <MovieCard
          name = {movie.name}
          duration={movie.duration}
          release_date= {movie.duration}
          image = {movie.image}
          rating= {movie.rating}
          category= {movie.category}
          director= {movie.director}
          cast={movie.cast}
          />
           </div>))
       }
      </div>
      <div className="flex flex-row ">
        <div className="basis-1/3 ">
         <h1><strong>Lion's Den</strong>  </h1> 
         <p className="text-2xl font-bold">Making Your Moments Special </p>
         <p className="mx-auto max-w-md">Lion's Den is the place we go for magic, where stories feel perfect and powerful. Academy Award® winner Nicole Kidman reveals why movies are better here than anywhere else.</p>
        </div>
        <div className="basis-2/3">
        <iframe
         className="w-full max-w-2xl h-64 md:h-96 ml-80 mb-10" 
         src="https://www.youtube.com/embed/Way9Dexny3w"
         title="youtube-trailer-openhiemer"
         allow="autoplay; picture-in-picture;"
         allowFullScreen
        />
        </div>
       
    </div>
    <div className="flex justify-center mt-10 mb-10">
          <QRCard />
        </div>
    
   
</div>
    </div>
   
    
    
  );
};

export default DiscoverMovies; 
