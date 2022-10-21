import KurvaComponent from "../components/KurvaComponent"
import NavbarComponent from "../components/NavbarComponent"
import { getDatabase, ref, child, get} from "firebase/database"
import { app } from '../firebase-config'
import { useState } from "react";

export default function Kurva(){

    const [data, setData] = useState(0);
    
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `Data`)).then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
    });

    let tegangan = parseFloat(data.Voltage).toFixed(2);
    let arus = parseFloat(data.Current).toFixed(2);
    let daya = parseFloat(data.Power).toFixed(2);

    return(
        <>
            <NavbarComponent/>
            <KurvaComponent
                tegangan={tegangan}
                arus={arus}
                daya={daya}
            />
        </>
    )
}