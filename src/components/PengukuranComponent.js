import { getDatabase, ref, child, get} from "firebase/database";
import { useState } from "react";
import { app } from '../firebase-config'

export default function PengukuranComponent(){

    const [ans, setAns] = useState(0);
    // let irradiant = 0;
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `Data`)).then((snapshot) => {
        if (snapshot.exists()) {
          setAns(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
    });

    let tegangan = parseFloat(ans.Voltage).toFixed(2);
    let arus = parseFloat(ans.Current).toFixed(2);
    let daya = parseFloat(ans.Power).toFixed(2);
    let irradiant = parseFloat(ans.Irradiant).toFixed(2);

    return(
            <div className=" px-5 lg:px-40 my-28 md:my-40 flex gap-5 justify-between text-center flex-col md:flex-row">
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                    <p className="font-semibold text-gray-500 mb-2">Tegangan</p>
                    <p className="text-4xl font-semibold text-gray-700">{tegangan} V</p>
                </div>
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                    <p className="font-semibold text-gray-500 mb-2">Arus</p>
                    <p className="text-4xl font-semibold text-gray-700">{arus} A</p>
                </div>
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                <p className="font-semibold text-gray-500 mb-2">Daya</p>
                    <p className="text-4xl font-semibold text-gray-700">{daya} watt</p>
                </div>
                <div className="p-10 lg:w-60 bg-gray-50 rounded-md shadow-md hover:shadow-lg cursor-pointer flex-1 text-center">
                <p className="font-semibold text-gray-500 mb-2">Irradiant</p>
                    <p className="text-4xl font-semibold text-gray-700">{irradiant} W/m<sup>2</sup></p>
                </div>
            </div>

    )
}