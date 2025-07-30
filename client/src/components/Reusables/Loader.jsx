


import toolsGif from '@assets/toolsgif.gif';

const Loader = ({text}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow flex flex-col items-center justify-center min-h-64">
    <img 
      src={toolsGif} 
      alt="טוען..." 
      className="h-24 w-24 object-contain mb-4"
    />
    <p className="text-gray-600">{text}</p>
</div>
  );
}
export default Loader;