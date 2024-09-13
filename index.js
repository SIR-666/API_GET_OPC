const express = require('express');
const { OPCUAClient, AttributeIds, resolveNodeId } = require("node-opcua");

const app = express();
const port = 5000;

// OPC UA connection details
const opcUrl = "opc.tcp://10.24.7.203:49320";
const itemsToRead = [
"AB_Network_02.Packing PB.bFL_AirPressureLow",
"AB_Network_02.Packing PB.bFL_AuxMCB_IsOpen",
"AB_Network_02.Packing PB.bFL_BoxAtInfeedCollatorJammed",
"AB_Network_02.Packing PB.bFL_BoxAtPusherAtStation2",
"AB_Network_02.Packing PB.bFL_BoxAtPusherQueueJammed",
"AB_Network_02.Packing PB.bFL_BufferConveyorFeedbackError",
"AB_Network_02.Packing PB.bFL_DoorSwitch_IsOpen",
"AB_Network_02.Packing PB.bFL_EmergencyStop_IsOpen",
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
"AB_Network_02.Packing PB.CLEAR_Fault",
"AB_Network_02.Packing PB.Drive_Fault",
"AB_Network_02.Packing PB.HardwareOverTravelNegative",
"AB_Network_02.Packing PB.InstError_Fault",
"AB_Network_02.Packing PB.NotReady_Fault",
"AB_Network_02.Packing PB.Out_StopperRejectWeigher",
"AB_Network_02.Packing PB.RESET_Fault",
"AB_Network_02.Packing PB.Soft_Over_Torque_Limit",
"AB_Network_02.Packing PB.START_Fault",
"AB_Network_02.Packing PB.STOP_Fault",
"AB_Network_02.Packing PB.Machine Mode Operator",
"AB_Network_02.Packing PB.Machine Mode Program",
"AB_Network_02.Packing PB.Machine State Aborted",
"AB_Network_02.Packing PB.Machine State Aborting",
"AB_Network_02.Packing PB.Machine State Clearing",
"AB_Network_02.Packing PB.Machine State Idle",
"AB_Network_02.Packing PB.Machine State Resetting",
"AB_Network_02.Packing PB.Machine State Running",
"AB_Network_02.Packing PB.Machine State Starting",
"AB_Network_02.Packing PB.Machine State Stopped",
"AB_Network_02.Packing PB.Machine State Stopping",
"AB_Network_02.Packing PB.Hours Meter"
];

// Function to fetch OPC UA data
async function fetchOpcData() {
    const client = OPCUAClient.create({ endpointMustExist: false });
    const results = [];

    try {
        // Connect to OPC UA server
        await client.connect(opcUrl);
        console.log("OPC UA client connected.");

        const session = await client.createSession();
        console.log("Session created.");

        // Fetch OPC data
        for (const item of itemsToRead) {
            try {
                const nodeId = resolveNodeId(`ns=2;s=${item}`);
                const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
                results.push({ item, value: dataValue.value.value });
            } catch (err) {
                console.error(`Error reading ${item}: ${err.message}`);
                results.push({ item, error: err.message });
            }
        }

        // Close session and disconnect client
        await session.close();
        console.log("Session closed.");
    } catch (err) {
        console.error(`Error: ${err.message}`);
        results.push({ error: err.message });
    } finally {
        await client.disconnect();
        console.log("OPC UA client disconnected.");
    }

    return results;
}

// API endpoint to get OPC UA data
app.get('/api/opc-data', async (req, res) => {
    try {
        const opcData = await fetchOpcData();
        res.json({ success: true, data: opcData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching OPC UA data', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
