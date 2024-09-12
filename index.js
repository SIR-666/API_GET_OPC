const { OPCUAClient, AttributeIds, resolveNodeId } = require("node-opcua");

// OPC UA connection details
//const opcUrl = "opc.tcp://GFOPC01PL:49320";
const opcUrl = "opc.tcp://10.24.7.203:49320";
const itemsToRead = [
  //  "AB_Network_02.CIP Filling.Return temperature CIP03",
   // "AB_Network_02.CIP Filling.Return temperature CIP02",
   // "AB_Network_02.CIP Filling.Return temperature CIP01",
   // "AB_Network_02.CIP Filling.Pressure temperature CIP02",
   // "AB_Network_02.CIP Filling.Pressure temperature CIP01",
   // "AB_Network_02.CIP Filling.Flow rate CIP03",
   // "AB_Network_02.CIP Filling.Flow rate CIP02",
   // "AB_Network_02.CIP Filling.Flow rate CIP01",
   // "AB_Network_02.CIP Filling.Differential_Press_FG",
   // "AB_Network_02.CIP Filling.Differential_Press_BC",
   // "AB_Network_02.CIP Filling.Conductivity CIP03",
   // "AB_Network_02.CIP Filling.Conductivity CIP02",
   // "AB_Network_02.CIP Filling.Conductivity CIP01",
   // "AB_Network_02.CIP Filling._CipConnectionSizeRequested",
  //  "AB_Network_02.CIP Filling._CipConnectionSizeActual"
"AB_Network_02.Packing PB.bFL_AirPressureLow",
"AB_Network_02.Packing PB.bFL_AuxMCB_IsOpen",
"AB_Network_02.Packing PB.bFL_BoxAtInfeedCollatorJammed",
"AB_Network_02.Packing PB.bFL_BoxAtPusherAtStation2",
"AB_Network_02.Packing PB.bFL_BoxAtPusherQueueJammed",
"AB_Network_02.Packing PB.bFL_BufferConveyorFeedbackError",
"AB_Network_02.Packing PB.bFL_DoorSwitch_IsOpen",
"AB_Network_02.Packing PB.bFL_EmergencyStop_IsOpen",
"AB_Network_02.Packing PB.bFL_Error_OB",
"AB_Network_02.Packing PB.bFL_Error_SB",
"AB_Network_02.Packing PB.bFL_ErrorVacuumCartonWhenOff",
"AB_Network_02.Packing PB.bFL_ErrorVacuumCartonWhenOn",
"AB_Network_02.Packing PB.bFL_HotmeltFaulted",
"AB_Network_02.Packing PB.bFL_HotmeltNotReady",
"AB_Network_02.Packing PB.bFL_InfeedBackConveyorFeedbackError",
"AB_Network_02.Packing PB.bFL_InfeedConveyorFeedbackError",
"AB_Network_02.Packing PB.bFL_PneuBackErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBackErrorRet",
"AB_Network_02.Packing PB.bFL_PneuBottomWingCloseLeftErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBottomWingCloseLeftErrorRet",
"AB_Network_02.Packing PB.bFL_PneuBottomWingCloseRightErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBottomWingCloseRightErrorRet",
"AB_Network_02.Packing PB.bFL_PneuBottomWingOpenLeftErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBottomWingOpenLeftErrorRet",
"AB_Network_02.Packing PB.bFL_PneuBottomWingOpenRightErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBottomWingOpenRightErrorRet",
"AB_Network_02.Packing PB.bFL_PneuBridgeErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBridgeErrorRet",
"AB_Network_02.Packing PB.bFL_PneuBufferSeparatorErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuBufferSeparatorErrorRet",
"AB_Network_02.Packing PB.bFL_PneuCartonPickErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuCartonPickErrorRet",
"AB_Network_02.Packing PB.bFL_PneuClampFrontErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuClampFrontErrorRet",
"AB_Network_02.Packing PB.bFL_PneuClampingErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuClampingErrorRet",
"AB_Network_02.Packing PB.bFL_PneuClampRearErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuClampRearErrorRet",
//"AB_Micro_Network_02.Cheese A.Status_Pasteurize",
//"AB_Micro_Network_02.Cheese A.Temp_Pasteurize",
//"AB_Network_02.Packing PB.START_Fault",
//"AB_Network_02.Packing PB.Conv1Error",
//"AB_Network_02.Packing PB.Conv2Error",
//"NET1_MBTCP.Filling PA.LastActiveAlarmMessage",
//"NET1_MBTCP.Filling PA.Machine_Status",
//"NET1_MBTCP.Filling PA.Alarm_ActiveStopReason"
"AB_Network_02.Packing PB.bFL_PneuClampRearErrorRet",
"AB_Network_02.Packing PB.bFL_PneuFrontGripLeftErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuFrontGripLeftErrorRet",
"AB_Network_02.Packing PB.bFL_PneuFrontGripRightErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuFrontGripRightErrorRet",
"AB_Network_02.Packing PB.bFL_PneuGuideBridgeErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuGuideBridgeErrorRet",
"AB_Network_02.Packing PB.bFL_PneuGuideInfeedErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuGuideInfeedErrorRet",
"AB_Network_02.Packing PB.bFL_PneuHolderErrorRet",
"AB_Network_02.Packing PB.bFL_PneuMagazineErrorRet",
"AB_Network_02.Packing PB.bFL_PneuMagazineErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuQueueSeparatorErrorRet",
"AB_Network_02.Packing PB.bFL_PneuQueueSeparatorErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuQueueStopperErrorRet",
"AB_Network_02.Packing PB.bFL_PneuQueueStopperErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuSideWingBottomErrorAdv_L",
"AB_Network_02.Packing PB.bFL_PneuSideWingBottomErrorAdv_R",
"AB_Network_02.Packing PB.bFL_PneuSideWingBottomErrorRet_L",
"AB_Network_02.Packing PB.bFL_PneuSideWingBottomErrorRet_R",
"AB_Network_02.Packing PB.bFL_PneuSideWingTopErrorAdv_L",
"AB_Network_02.Packing PB.bFL_PneuSideWingTopErrorRet_L",
"AB_Network_02.Packing PB.bFL_PneuStopperInfeedErrorRet",
"AB_Network_02.Packing PB.bFL_PneuStopperInfeedErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuTopWingCloseErrorAdv",
"AB_Network_02.Packing PB.bFL_PneuTopWingCloseErrorRet",
"AB_Network_02.Packing PB.bFL_QueueConveyorFeedbackError",
"AB_Network_02.Packing PB.bFL_SideWingBottomLeftErrorAdv",
"AB_Network_02.Packing PB.bFL_SideWingBottomRightErrorAdv",
"AB_Network_02.Packing PB.bFL_SolenoidDoorLock_IsOpen",
"AB_Network_02.Packing PB.BoxJammedConv1",
"AB_Network_02.Packing PB.BoxJammedConv2",
"AB_Network_02.Packing PB.BoxJammedConv3",
"AB_Network_02.Packing PB.CLEAR_Fault",
"AB_Network_02.Packing PB.Conv1Error",
"AB_Network_02.Packing PB.Conv2Error",
"AB_Network_02.Packing PB.Conv3Error",
"AB_Network_02.Packing PB.Drive_Fault",
"AB_Network_02.Packing PB.HardwareOverTravelNegative",
"AB_Network_02.Packing PB.InstError_Fault",
"AB_Network_02.Packing PB.NotReady_Fault",
"AB_Network_02.Packing PB.Out_StopperRejectWeigher",
"AB_Network_02.Packing PB.RESET_Fault",
"AB_Network_02.Packing PB.Soft_Over_Torque_Limit",
"AB_Network_02.Packing PB.START_Fault",
"AB_Network_02.Packing PB.STOP_Fault",
"AB_Network_02.Packing PB.UBypassBoxJamInfeed",
"AB_Network_02.Packing PB.UBypassBoxJamPusherQueue",
"AB_Network_02.Packing PB.UBypasspneumaticback",
"AB_Network_02.Packing PB.Application_FaultCode",
"AB_Network_02.Packing PB.Application_FaultStatus1",
"AB_Network_02.Packing PB.Application_FaultStatus2",
"AB_Network_02.Packing PB.Application_FaultStatus3"
];

// Fetch OPC UA data
async function fetchOpcData() {
    console.log("trial");	
    const client = OPCUAClient.create({ endpointMustExist: false });

    try {
        // Connect to OPC UA server
        await client.connect(opcUrl);
        console.log("OPC UA client connected.");

        const session = await client.createSession();
        console.log("Session created.");
       while(1)
	{	
        // Fetch OPC data
        for (const item of itemsToRead) {
            try {
                const nodeId = resolveNodeId(`ns=2;s=${item}`);
                const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
                console.log(`${item}: ${dataValue.value.value}`);
            } catch (err) {
                console.error(`Error reading ${item}: ${err.message}`);
            }
       }
	}

       //  Close session and disconnect client
        await session.close();
        console.log("Session closed.");
    } catch (err) {
        console.error(`Error: ${err.message}`);
    } finally {
        await client.disconnect();
        console.log("OPC UA client disconnected.");
    }
}

fetchOpcData();
