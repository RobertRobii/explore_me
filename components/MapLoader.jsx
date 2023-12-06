export default function MapLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-2xl font-bold text-orange-500">A map is loading</p>
        <img
          className="mx-auto my-4"
          src="/assets/images/loader.gif"
          alt="Loading"
        />
      </div>
    </div>
  );
}
