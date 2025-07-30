




const Error = ({title, error, className }) => {
    return (
        <div className={`bg-white p-8 rounded-xl shadow min-h-64 font-inter ${className} `}>
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <p className="font-medium">{title}</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        </div>
    );
}

export default Error;