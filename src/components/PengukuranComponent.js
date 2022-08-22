export default function PengukuranComponent(){
    return(
        <>
            <div className=" px-5 lg:px-40 my-28 md:my-40 flex gap-5 justify-between text-center flex-col md:flex-row">
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                    <p className="font-semibold text-gray-500 mb-2">Tegangan</p>
                    <p className="text-4xl font-semibold text-gray-700">25 V</p>
                </div>
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                    <p className="font-semibold text-gray-500 mb-2">Arus</p>
                    <p className="text-4xl font-semibold text-gray-700">10 A</p>
                </div>
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                <p className="font-semibold text-gray-500 mb-2">Daya</p>
                    <p className="text-4xl font-semibold text-gray-700">100 watt</p>
                </div>
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                <p className="font-semibold text-gray-500 mb-2">Irradiant</p>
                    <p className="text-4xl font-semibold text-gray-700">10 i</p>
                </div>
            </div>
        </>
    )
}