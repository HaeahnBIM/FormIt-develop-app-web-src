import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import PlanChart from "./components/PlanChart";

const baseuri = "https://ueapi.haeahn.com/api/formit/";

function App() {
  const [plans, setPlans] = React.useState([]);
  const [dongs, setDongs] = React.useState([]);
  const [floors, setFloors] = React.useState([]);
  const [charts, setCharts] = React.useState([]);

  let dataChart = [
    {
      id: "lisp",
      label: "lisp",
      value: 50,
      color: "hsl(78, 70%, 50%)",
    },
    {
      id: "make",
      label: "make",
      value: 479,
      color: "hsl(22, 70%, 50%)",
    },
    {
      id: "javascript",
      label: "javascript",
      value: 319,
      color: "hsl(146, 70%, 50%)",
    },
    {
      id: "go",
      label: "go",
      value: 219,
      color: "hsl(53, 70%, 50%)",
    },
    {
      id: "hack",
      label: "hack",
      value: 507,
      color: "hsl(158, 70%, 50%)",
    },
  ];

  const rateValueFormatter = (params) => {
    if (params.value == null) {
      return "";
    }
    const valueFormatted = Number((params.value * 100).toFixed(2));
    return `${valueFormatted} %`;
  };

  const numberValueFormatter = (params) => {
    if (params.value == null) {
      return "";
    }
    const valueFormatted = Number(params.value.toFixed(2)).toLocaleString();
    return valueFormatted;
  };

  const colsGrid0 = [
    { field: "col1", headerName: "프로젝트", width: 200 },
    {
      field: "col2",
      headerName: "건축면적",
      width: 100,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    {
      field: "col3",
      headerName: "건폐율",
      width: 100,
      type: "number",
      valueFormatter: rateValueFormatter,
    },
    {
      field: "col4",
      headerName: "연면적",
      width: 100,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    {
      field: "col5",
      headerName: "지상연면적",
      width: 100,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    {
      field: "col6",
      headerName: "주거연면적",
      width: 100,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    {
      field: "col7",
      headerName: "용적률",
      width: 100,
      type: "number",
      valueFormatter: rateValueFormatter,
    },
    {
      field: "col8",
      headerName: "주거용적률",
      width: 100,
      type: "number",
      valueFormatter: rateValueFormatter,
    },
    { field: "col9", headerName: "id", width: 50, hideable: false, hide: true },
  ];
  const colsGrid1 = [
    { field: "col1", headerName: "용도", width: 150 },
    { field: "col2", headerName: "동", width: 150 },
    {
      field: "col3",
      headerName: "층수",
      width: 100,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    {
      field: "col4",
      headerName: "연면적",
      width: 150,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    { field: "col5", headerName: "id", width: 50, hideable: false, hide: true },
    {
      field: "col6",
      headerName: "idplan",
      width: 50,
      hideable: false,
      hide: true,
    },
  ];
  const colsGrid2 = [
    { field: "col1", headerName: "동", width: 150 },
    { field: "col2", headerName: "구분", width: 100 },
    {
      field: "col3",
      headerName: "층수",
      width: 100,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    {
      field: "col4",
      headerName: "층별면적",
      width: 150,
      type: "number",
      valueFormatter: numberValueFormatter,
    },
    { field: "col5", headerName: "id", width: 50, hideable: false, hide: true },
  ];

  const callApi = async (api) => {
    const response = await fetch(api);
    const body = await response.json();
    return body;
  };

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  // 프로젝트정보가져오기
  const handleProjectPlan = (e) => {
    console.log("handleProjectPlan: start: ");

    setPlans([]);
    let rows = [];
    callApi(baseuri + "projects/plans")
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          rows.push({
            id: i,
            col1: res[i].NM_PROJ,
            col2: Number(res[i].AREA_BLD),
            col3: Number(res[i].RATE_BLDCV),
            col4: Number(res[i].AREA_TTA),
            col5: Number(res[i].AREA_ALL_GRND),
            col6: Number(res[i].AREA_HUS_GRND),
            col7: Number(res[i].RATE_ALL_GRND),
            col8: Number(res[i].RATE_HUS_GRND),
            col9: res[i].ID,
          });
          //console.log("handleProjectPlan: ", rows);
        }
        setPlans(rows);
      })
      .catch((err) => console.log(err));
      console.log("handleProjectPlan: end: ");
  };

  // 프로젝트정보가져오기 동
  const handleProjectPlanDong = async (e) => {
    console.log("handleProjectPlanDong: start: ");

    setDongs([]);
    setFloors([]);
    const postData = {
      ID_PLAN: e.row.col9,
    };

    console.log(baseuri + `project/planDongs`, postData);

    //console.log(postData);

    try {
      const res = await fetch(baseuri + `project/planDongs`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };
      //setPostResult(fortmatResponse(result));
      //console.log(data);

      let planDongs = [];
      let chartDongs = [];
      for (let i = 0; i < data.length; i++) {
        const dongData = data[i];
        //console.log(dongData);

        // const colsGrid1 = [
        //   { field: "col1", headerName: "용도", width: 300 },
        //   { field: "col2", headerName: "동", width: 150 },
        //   { field: "col3", headerName: "층수", width: 150 },
        //   { field: "col4", headerName: "연면적", width: 150 },
        //   { field: "col5", headerName: "id", width: 50, hideable: false, hide: true },
        // ];

        planDongs.push({
          id: dongData.ID,
          col1: dongData.NM_LAYR,
          col2: dongData.NM_DONG,
          col3: dongData.NMBR_FLR_GRND,
          col4: dongData.AREA_GRND,
          col5: dongData.ID,
          col6: dongData.ID_PLAN,
        });

        chartDongs.push({
          id: dongData.NM_DONG,
          label: dongData.NM_DONG,
          value: dongData.AREA_GRND,
          //color: "hsl(78, 70%, 50%)",
        }); 
      }
      setDongs(planDongs.map((row) => ({ ...row })));
      setCharts(chartDongs.map((row) => ({ ...row })));

      // for (let i = 0; i < data.length; i++) {
      //   const dongData = data[i];
      //   console.log(dongData);
  
      //   chartDongs.push({
      //     id: dongData.ID,
      //     label: dongData.NM_DONG,
      //     value: dongData.AREA_GRND,
      //     color: "hsl(78, 70%, 50%)",
      //   });  
      // }
  
      //console.log(charts);

      //setDongs(fortmatResponse(result));
      //planId = result0.data[0].id;
    } catch (err) {
      //setPostResult(err.message);
      console.log(err);
    }

    //console.log("=======================================");
    //console.log(postData);

    //console.log("=======================================");
    try {
      const res = await fetch(baseuri + `project/planFloors`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data1 = await res.json();
      const result = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data1,
      };
      //setPostResult(fortmatResponse(result));
      //console.log(data);

      //console.log("---------------------------------------");
      //console.log(data1);

      let planFloorss = [];
      for (let i = 0; i < data1.length; i++) {
        const floorData = data1[i];
        //console.log(data1.length);
        //console.log(i);

        // const colsGrid2 = [
        //   { field: "col1", headerName: "동", width: 300 },
        //   { field: "col2", headerName: "구분", width: 150 },
        //   { field: "col3", headerName: "층수", width: 150 },
        //   { field: "col4", headerName: "층별면적", width: 150 },
        //   { field: "col5", headerName: "id", width: 50, hideable: false, hide: true },
        // ];

        planFloorss.push({
          id: i,
          col1: floorData.NM_DONG,
          col2: floorData.NM_LEVLS,
          col3: floorData.NMBR_FLR_GRND,
          col4: floorData.AREA_LEVL,
          col5: floorData.ID,
        });
      }
      setFloors(planFloorss.map((row) => ({ ...row })));
    } catch (err) {
      console.log(err);
    }

    console.log("handleProjectPlanDong: end: ");
  };

  // 프로젝트정보가져오기 층
  const handleProjectPlanFloor = (e) => {
    console.log("handleProjectPlanFloor: start: ", e);

    setFloors([]);
    let rows = [];
    callApi(baseuri + "projects/plans")
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          rows.push({
            id: i,
            col1: res[i].NM_PROJ,
            col2: Number(res[i].AREA_BLD.toFixed(2)),
            col3: Number((res[i].RATE_BLDCV * 100).toFixed(2)) + "%",
            col4: Number(res[i].AREA_TTA.toFixed(2)),
            col5: Number(res[i].AREA_ALL_GRND.toFixed(2)),
            col6: Number(res[i].AREA_HUS_GRND.toFixed(2)),
            col7: Number((res[i].RATE_ALL_GRND * 100).toFixed(2)) + "%",
            col8: Number((res[i].RATE_HUS_GRND * 100).toFixed(2)) + "%",
          });
          //console.log("handleProjectPlan: ", rows);
        }
        setFloors(rows);
      })
      .catch((err) => console.log(err));
  };

  const handleClick = (e) => {
    console.log(e);
  };

  return (
    <div className="App">
      <Button variant="contained" color="primary" onClick={handleProjectPlan}>
        프로젝트플랜
      </Button>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={handleProjectPlanDong}
      >
        동
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleProjectPlanFloor}
      >
        층
      </Button> */}
      <div className="TopDataGridContainer">
        <DataGrid
          className="DataGrid"
          headerHeight={40}
          rowHeight={30}
          rows={plans}
          columns={colsGrid0}
          onRowClick={handleProjectPlanDong}
        />
        <PlanChart style={{ width: "100%" }} className="Chart" data={charts} />
      </div>
      <div className="BottomDataGridContainer">
        <DataGrid
          headerHeight={40}
          rowHeight={30}
          className="DataGrid"
          style={{ width: "50%" }}
          rows={dongs}
          columns={colsGrid1}
        />
        <DataGrid
          headerHeight={40}
          rowHeight={30}
          className="DataGrid"
          rows={floors}
          columns={colsGrid2}
        />
      </div>
    </div>
  );
}

export default App;
