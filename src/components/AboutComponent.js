import Logo from '../assets/logo.png'

export default function AboutComponent(){
    return(
        <div  className="px-5 lg:px-40 my-40">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 flex place-content-center">
                    <img src={Logo} className="object-cover h-full w-60" alt='' />
                </div>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-800 mb-4">ABOUT MOFEC</h1>
                    <p className="leading-relaxed text-gray-800 text-lg">
                        MOFEC(Monitoring Performance Photovoltaic) merupakan sistem pengukuran performansi terhadap panel surya,
                        untuk mengetahui keluaran yang dihasilkan oleh panel surya berdasarkan parameter MPP (Maksimum Power Point)
                    </p>
                </div>
            </div>
        </div>
    )
}