import KurvaComponent from "../components/KurvaComponent"
import NavbarComponent from "../components/NavbarComponent"
import { getDatabase, ref, child, get} from "firebase/database"
import { app } from '../firebase-config'
import { useState } from "react";

export default function Kurva(){

    const [ans, setAns] = useState(0);
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