import { MovieCard } from "../components/UI/MovieCard";

const SAVED_MOVIES = [
    { id: 1, title: "Interstellar Horizon", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=60", match: "98%", age: "16+", duration: "2h 15m" },
    { id: 2, title: "The Dark Knight's Return", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&w=500&q=60", match: "95%", age: "13+", duration: "2h 30m" },
    { id: 3, title: "Paris Morning", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=60", match: "92%", age: "13+", duration: "1h 45m" },
    { id: 4, title: "Cosmos: Deep Space", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=60", match: "90%", age: "All", duration: "1h 30m" },
    { id: 5, title: "Neon Shadows", image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=60", match: "89%", age: "18+", duration: "1h 55m" },
    { id: 6, title: "Arcane Realm", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=60", match: "97%", age: "13+", duration: "2h 10m" },
    { id: 7, title: "Cyber Life", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=60", match: "96%", age: "18+", duration: "2h 25m" },
    { id: 8, title: "The Long Way Home", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=500&q=60", match: "94%", age: "13+", duration: "2h 05m" },
];

export function MyList() {
    return (
        <div className="pt-24 px-4 md:px-12 min-h-screen pb-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white">My List</h1>

            {SAVED_MOVIES.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {SAVED_MOVIES.map((movie) => (
                        <div key={movie.id} className="w-full">
                            <MovieCard {...movie} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <p>Your list is empty.</p>
                    <p className="text-sm mt-2">Add shows and movies that you want to watch later.</p>
                </div>
            )}
        </div>
    );
}
