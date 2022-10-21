import React, { useRef, useState } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

export default function KurvaComponent({tegangan, arus, daya}){

    const chart = useRef();
    const [Isc, setIsc] = useState(8);
    const [Voc, setVoc] = useState(41);

    // const [dataArus, setDataArus] = useState(8);
    // const [dataDaya, setDataDaya] = useState(330);

    // if(dataArus !== arus){
    //   setDataArus(arus)
    // }

    console.log(arus);
    console.log(tegangan);
    console.log(daya);

    const kurvaIV = {
      chart: {
          type: 'spline'
      },
      title: {
          text: 'Kurva IV'
      },
      xAxis: {
        tickmarkPlacement: 'on',
        title: {
          text: 'Tegangan (V)'
        },
        min:0,
        max: Voc,
      },
      yAxis: {
        min: 0,
        // max: Isc,
        tickmarkPlacement: 'on',
        title: {
          text: 'Arus (A)'
        },
      },
      tooltip: {
          crosshairs: true,
          shared: true
      },
      series: [{
          name: 'Arus (A)',
          data: [
            {y:6.6,x:0},
            {y:6.14,x:tegangan},
            {y:0,x:Voc}]
    
      },]
    };

    const kurvaPV = {
      chart: {
          type: 'spline'
      },
      title: {
          text: 'Kurva PV'
      },
      xAxis: {
        tickmarkPlacement: 'on',
        title: {
          text: 'Tegangan (V)'
        },
        min:0,
        max: Voc,
      },
      yAxis: {
        min: 0,
        tickmarkPlacement: 'on',
        title: {
          text: 'Power (watt)'
        },
      },
      tooltip: {
          crosshairs: true,
          shared: true
      },
      series: [{
          name: 'Power (watt)',
          data: [
            {y:0,x:0},
            {y:182.36,x:tegangan},
            {y:0,x:Voc}]
    
      },]
    };

    // setTegangan(ans.Voltage);
    // setArus(ans.Current);
    // setDaya(ans.Power);

    return(
      <div className='flex flex-col lg:flex-row mx-5 lg:mx-10 gap-5 mt-40'>
        <div className='flex-1 p-5 shadow-md ring-1 ring-gray-200 rounded-md'>
          <div className='mb-5'>
              <HighchartsReact ref={chart} highcharts={Highcharts} options={kurvaIV} />
          </div>
          <div id="login-form" className="flex flex-col md:flex-row gap-2 md:gap-10">
            <div className='flex-col'>
                <input
                    onChange={(e) => {
                      setIsc(e.target.value)
                    }}     
                    type="number"
                    id="input-isc"
                    placeholder='Isc'
                    className="p-2 rounded-md shadow-sm focus:shadow-md mb-3 border border-gray-400"
                  />
            </div>
            <div className='flex-col'>
                <input   
                    onChange={(e) => {
                      setVoc(e.target.value)
                    }}    
                    type="number"
                    id="input-voc"
                    placeholder='Voc'
                    className="p-2 rounded-md shadow-sm focus:shadow-md mb-3 border border-gray-400"
                  />
            </div>
          </div>
        </div>

        <div className='flex-1 p-5 shadow-md ring-1 ring-gray-200 rounded-md'>
          <div className='mb-5'>
              <HighchartsReact ref={chart} highcharts={Highcharts} options={kurvaPV} />
          </div>
        </div>
      </div>
    )
}
