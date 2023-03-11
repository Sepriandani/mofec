import React, { useEffect, useReducer, useRef, useState } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ClipLoader from 'react-spinners/ClipLoader';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

export default function KurvaComponent({tegangan, arus, daya}){

    
    const IscRef = useRef();
    const VocRef = useRef();

    const [Isc, setIsc] = useState(9.12);
    const [Voc, setVoc] = useState(45.9);
    const [, forceUpdate] = useReducer(x => x + 2, 0);
    const [Vmp, setVmp] = useState(0)
    const [Imp, setImp] = useState(0)
    const [loadingInProgress, setLoading] = useState(false);
    // const [fillFactor, setFillFactor] = useState(0)

    function onSubmit(e){

      e.preventDefault()
      if(IscRef.current.value){
        setIsc(parseFloat(IscRef.current.value));
      }
      if(VocRef.current.value){
        setVoc(VocRef.current.value);
      }
      forceUpdate();

      setLoading(true)
      setTimeout(() => setLoading(false), 1000)
    }

    useEffect(()=>{
      setTimeout(() => setImp(arus), 500)
    }, [arus])

    useEffect(()=>{
      setTimeout(() => setVmp(tegangan), 500)
      setLoading(true)
      setTimeout(() => setLoading(false), 1000)
    }, [tegangan])


    const chartComponent = useRef();
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
        tickmarkPlacement: 'on',
        title: {
          text: 'Arus (A)'
        },
				min: 0,
        max: Isc,
      },
      tooltip: {
          crosshairs: true,
          shared: true
      },
      series: [{
          name: 'Arus (A)',
          data: [
            {y:Isc,x:0},
            {y:7,x:Vmp},
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
            {y:182.36,x:Vmp},
            {y:0,x:Voc}]
    
      },]
    };

    useEffect(() => {
      setLoading(true)
      setTimeout(() => setLoading(false), 1000)

    }, []);

    useEffect(() => {
      const chart = chartComponent.current?.chart;
  
      if (chart) chart.reflow(false);
      forceUpdate();

    }, [Voc]);

    useEffect(() => {
      const chart = chartComponent.current?.chart;
  
      if (chart) chart.reflow(false);
      forceUpdate();

    }, [Isc]);

    let value = ((Vmp * Imp) / (Voc * Isc)) * 100;
    let fillFactor = parseFloat(value).toFixed(2)
    console.log(fillFactor)

    return(
      <div className='flex flex-col lg:flex-row mx-5 lg:mx-10 gap-5 mt-40'>
        <div className='flex-1 p-5 shadow-md ring-1 ring-gray-200 rounded-md'>
          <div className='mb-5'>
          { loadingInProgress ?
            (<div className="h-96 flex place-items-center"><ClipLoader className='m-auto' color={'#000'} size={150} /> </div>) :
            (<HighchartsReact ref={chartComponent} highcharts={Highcharts} options={kurvaIV}/>)
          }
          </div>
          <form onSubmit={onSubmit}  className="flex flex-col md:flex-row gap-2 md:gap-10">
                <input
                    ref={IscRef}     
                    type="number"
										step={0.001}
                    id="input-isc"
                    placeholder='Isc'
                    className="p-2 rounded-md shadow-sm focus:shadow-md mb-3 border border-gray-400"
                  />

                <input   
                    ref={VocRef}   
                    type="number"
										step={0.001}
                    id="input-voc"
                    placeholder='Voc'
                    className="p-2 rounded-md shadow-sm focus:shadow-md mb-3 border border-gray-400"
                  />
                  <button type='submit' className='bg-yellow-500 px-4 py-2 rounded-md'>submit</button>
          </form>
        </div>

        <div className='flex-1 p-5 shadow-md ring-1 ring-gray-200 rounded-md'>
          <div className='mb-5'>
          { loadingInProgress ?
            (<div className="h-96 flex place-items-center"><ClipLoader className='m-auto' color={'#000'} size={150} /> </div>) :
            (<HighchartsReact ref={chartComponent} highcharts={Highcharts} options={kurvaPV}/>)
          }
          </div>
          <div className='flex gap-5 place-items-center'>
            {
              fillFactor > 80 ?
              (
                <div className='flex gap-2  place-items-center'>
                  <div className='ml-10 p-4 bg-green-600 inline rounded-full'></div>
                  <div className='text-gray-600'>HIGH</div>
                </div>
              ):
              (
                <div className='flex gap-2  place-items-center'>
                  <div className='ml-10 p-4 bg-red-500 inline rounded-full'></div>
                  <div className='text-gray-600'>LOW</div>
                </div>
              )
            }
            <div className='text-gray-600'>Fill Factor : {fillFactor} %</div>
          </div>
        </div>
      </div>
    )
}