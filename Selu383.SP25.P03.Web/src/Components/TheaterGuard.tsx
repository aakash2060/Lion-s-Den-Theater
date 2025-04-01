
import { useTheater } from "../context/TheaterContext";

const TheaterGuard = ({ children }: { children: React.ReactNode }) => {
  const { theater, loadingTheater } = useTheater();

  if (loadingTheater) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        ⏳ Finding nearest theater...
      </div>
    );
  }

  if (!theater) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        ⚠️ No theater selected. Please refresh or try again.
      </div>
    );
  }

  return <>{children}</>;
};

export default TheaterGuard;
