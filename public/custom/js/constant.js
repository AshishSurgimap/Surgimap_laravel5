/**
 * Created By   : Aloha Technology
 * Created On   : 11th Feb, 2015
 * Description  : File contains all global variable used throughout the application
 */

//main.js

var baseUrl = '';
var patientCaseData = '';
var imageAreaSelect = '';
var templateDetails = '';
var allSurgeonEmail = '';
var files = new Object();
var filesList = {};
var isMeasurePage = 0;
var form_change = false;
var loadCalendarAPI = true;
var appLocation     = "https://itunes.apple.com/us/app/surgimap/id703574549?mt=8";
var appLaunchUrl    = "surgimap://";
var isPendingAJAXRequest = 0;
var isPendingAJAXRequestForStudyCasePatient = 0;
var isPendingAJAXRequestForPatient = '';
var isPendingAJAXRequestForStudtCase = '';
var selectedPatientIds = [];
var linkedPatientIds   = [];

//Browser info
var isLtIE9             = 0;
var windowWidth         = 0;
var browserCheck        = new Object();
browserCheck.name       = 'Explorer';
browserCheck.version    = 9;

//Image crop functionality
var xAxis      = 0;
var x2Axis     = 0;
var yAxis      = 0;
var y2Axis     = 0;
var thumbWidth = 0;
var thumbHeight  = 0;
var imgHeight    = 0;
var imgWidth     = 0;
var popupBoxOpen = 0;

var isFirstTime = 0;
var isFirstTimeFilter = 1;

var isPreviousClickID = 0;
var userFeatureList = {};

//set default font size
var defaultFontSize = 8;
var previousSettingsData;

//measure.js
var clicks                  = 0;
var lastClick               = [0, 0];
var previousClickedPoints   = new Array();
var flag = 0;
var maxMeasureTextLimitCage = 7;

//Browser info
var browserCheck        = new Object();
browserCheck.name       = 'Explorer';
browserCheck.version    = 9;

//Set zoom variables
var zoomDelta       = 0.3;
var maxZoomLevels   = 9;
var currentScale    = 1;

var startX, startY, isDown = false;

//Set default size for canvas width/height
var canvasWidth     = 600;
var canvasHeight    = 370;

//Offset values
var offsetX     = 0;
var offsetX1    = 0;
var offsetY     = 0;
var offsetY1    = 0;

//Get screen resolution details
var screenWidth     = window.screen.width;
var screenHeight    = window.screen.height;

//Initialize image width, height
var newImageWidth   = 0;
var newImageHeight  = 0;

//Canvas mode cursor
var normalModeCursor    = 'pointer';
var drawModeCursor      = 'crosshair';
var zoomModeCursor      = 'move';

//Expand collapse image, used for change run time image src
var collapseImage   = 'min_toggle.png';
var expandImage     = 'plus_toggle.png';

//Default font
var defaultFont = 'bold 24px Times New Roman';

//Watermark text color
var wattermarkTextColor = '#4d6eab';

//Click point radious
var clickPointRadious = 2;

//Measure selection circle radious
var selectionCircleRadius = 5;

var selectedMeasureType = 0;

//Thickness and font range
var thicknessRange = [0,10];
var fontSizeRange = [1,30];
var tempMovablePoints = {x:'no_value', y:'no_value'};
var tempMovableSecPoints = {x:'no_value', y:'no_value'};
//Measure types
var lineMeasure         = 2;
var circleMeasure       = 4;
var angleMeasure        = 7;
var lLordoMeasure       = 9;
var tKyphoMeasure       = 10;
var cobbMeasure         = 42;
var SVAMeasure          = 31;
var plumblineMeasure    = 18;
var pelvicMeasure       = 12;
var t1SPiMeasure        = 27;
var spondyMeasure       = 17;
var rvadMeasure         = 11;
var textMeasure         = 13;
var refLineMeasure      = 15;
var screwMeasure        = 14;
var cageMeasure         = 20;
var openMeasure         = 25;
var resetMeasure        = 26;
var wedgeMeasure        = 21;
var nuVasiveCageMeasure = 34;
var nuVasiveCageNewMeasure = 41;
var medicreaRodMeasure  = 36;
var alignmentMeasure    = 37;
var alignmentRodMeasure = 36;
var lLengthMeasure      = 28;
var k2mCageMeasure      = 45;

//All measures array
var allMeasures = [lineMeasure, circleMeasure, angleMeasure, lLordoMeasure, tKyphoMeasure, cobbMeasure, SVAMeasure,
    plumblineMeasure, pelvicMeasure, t1SPiMeasure, spondyMeasure, rvadMeasure, textMeasure, refLineMeasure, screwMeasure,
    cageMeasure, openMeasure, resetMeasure, wedgeMeasure, nuVasiveCageMeasure, nuVasiveCageNewMeasure, medicreaRodMeasure,
    alignmentMeasure, alignmentRodMeasure, k2mCageMeasure];

//Measure Type list
var measureTypeList                 = new Array();
measureTypeList[lineMeasure]        = 'Line';
measureTypeList[circleMeasure]      = 'Circle';
measureTypeList[angleMeasure]       = 'Angle';
measureTypeList[lLordoMeasure]      = 'L Lordo';
measureTypeList[tKyphoMeasure]      = 'T Kypho';
measureTypeList[cobbMeasure]        = 'Cobb';
measureTypeList[SVAMeasure]         = 'SVA';
measureTypeList[plumblineMeasure]   = 'Plumbline';
measureTypeList[pelvicMeasure]      = 'Pelvic';
measureTypeList[t1SPiMeasure]       = 'T1 SPi';
measureTypeList[spondyMeasure]      = 'Spondy';
measureTypeList[rvadMeasure]        = 'RVAD';
measureTypeList[textMeasure]        = '';
measureTypeList[refLineMeasure]     = 'Reference Line';
measureTypeList[screwMeasure]       = 'Screw';
measureTypeList[cageMeasure]        = 'Cage';
measureTypeList[openMeasure]        = 'Opening Osteotomy';
measureTypeList[resetMeasure]       = 'Resect Osteotomy';
measureTypeList[wedgeMeasure]       = 'Wedge';
measureTypeList[nuVasiveCageMeasure]= 'NuVasive Cage';
measureTypeList[nuVasiveCageNewMeasure]= 'NuVasive Cage';
measureTypeList[k2mCageMeasure]     = 'AN';
measureTypeList[alignmentMeasure]   = 'Alignment';
measureTypeList[alignmentRodMeasure]= 'UNiD SA Rod';

//Measure counts array
var measureCounts = {};
measureCounts[0] = {};
measureCounts[1] = {};

for(var index = 0; index < allMeasures.length; index ++){
    //Left canvas measure count
    measureCounts[0][allMeasures[index]] = 0;

    //Right canvas measure count
    measureCounts[1][allMeasures[index]] = 0;
}

//Left canvas measure count
measureCounts[0]['measureCount'] = 0;

//Right canvas measure count
measureCounts[1]['measureCount'] = 0;

//Measures default colors
var measureDefaultColors                    = new Array();
measureDefaultColors[lineMeasure]           = '#4bf51b';      //Green
measureDefaultColors[circleMeasure]         = '#ff3399';    //Red
measureDefaultColors[angleMeasure]          = '#ffff00';     //Yellow
measureDefaultColors[lLordoMeasure]         = '#10f614';    //Light green
measureDefaultColors[tKyphoMeasure]         = '#47a3e2';    //Sky blue
measureDefaultColors[cobbMeasure]           = '#ffff00';    //Yellow
measureDefaultColors[SVAMeasure]            = '#ff00ff';       //Pink
measureDefaultColors[plumblineMeasure]      = '#ccff99';
measureDefaultColors[pelvicMeasure]         = '#FC4F09';    //Orrange
measureDefaultColors[t1SPiMeasure]          = '#17C3C0';
measureDefaultColors[rvadMeasure]           = '#17C3C0';
measureDefaultColors[textMeasure]           = '#17C3C0';
measureDefaultColors[refLineMeasure]        = '#17C3C0';
measureDefaultColors[screwMeasure]          = '##6666ff';
measureDefaultColors[cageMeasure]           = '#ff8000';
measureDefaultColors[openMeasure]           = '#ffff00';
measureDefaultColors[resetMeasure]          = '#ff00cf';
measureDefaultColors[wedgeMeasure]          = '#ff1c1c';
measureDefaultColors[nuVasiveCageMeasure]   = '#17C3C0';
measureDefaultColors[nuVasiveCageNewMeasure]= '#BA6EAB';
measureDefaultColors[alignmentMeasure]      = '#ff1c1c';
measureDefaultColors[alignmentRodMeasure]   = '#cc99ff';
measureDefaultColors[spondyMeasure]         = '#ff00ff';
measureDefaultColors[k2mCageMeasure]        = '#ffff00';

//Angle measure group
var angleMeasureGroup = [angleMeasure, lLordoMeasure, tKyphoMeasure, cobbMeasure];

//Measure group for SVA similar measure like Plumbline
var SVAMeasureGroup = [SVAMeasure, plumblineMeasure];

//Measure name text max limit, if limit exceed then it will display like 'measure name...'
var maxMeasureTextLimit = 16;

//Pelvic measures reference point
var pelvicMeasureReferencePointData = new Object();
var t1SpiMeasureSecondPointData = new Object();
var reflineMeasureReferencePointData = new Object();

//Default flag values for show/hide scout nav line for left and right series of images
var showHideScoutNavLineData = [1,1];

//DICOM Rows and columns tag default value
var tagRows     = 512;
var tagColumns  = 512;

//Default value for max width/height
var maxWidth    = 409;
var maxHeight   = 400;

var allImageProperties = new Object();
var leftCanvasDraw, rightCanvasDraw, leftCanvasImg, rightCanvasImg, tempCanvas, canvas, canvasBack;

var canvasWidthHeight       = new Object();
canvasWidthHeight.width     = 0;
canvasWidthHeight.height    = 0;

var isLtIE9 = 0;
var imageMeasureJsonData    = new Object();
imageMeasureJsonData.data   = '';

//Flag to check while delete measure using delete key press
var isReadyToDelete = 1;

//All files flag for isDicom
var filesIsDicomData = new Object();

//Flag for image calibration
var isCalibrationMode = 0;

var isResetAction = 0;
var isWaitForUpdate = 0;
var isWaitForDrawResponse = 0;

//Angle curve length
var angleCurveLength = 20;

//Distance value space from measure to measure text
var distFromMeasure = 5;

//0 - AntPost 1- PostAnt
var antPostData = 0;

//Calibration value max limit
var calibrateMaxValLimit = 100000;

//Edit Image permission
var canEditImage = 0;

var imageOriginalSize = [{w:0, h:0},{w:0, h:0}];
var originalImageWidth = 0;
var originalImageHeight = 0;

var initWithSplineSize = 0;
var SAQSpline = [];
var SAQSplineSize = 0;
var SAQSplineA = [];
var SAQSplineB = [];
var SAQSplineC = [];
var SAQSplinePoints = [];
var splinePointPerpDist = 1;
var pointListForDraw = [];

//To check from modal for line thickness and font size field
var isFromThicknessModal = 0;
var isFromFontModal      = 0;

var isFirstTime = 1;

var browser;
var version;

var measureContainerHeight = 0;
var measureContainerWidth = 0;
var toggleParentHeight  = 0;
var toggleParentWidth  = 0;
var containerWidth = 0;
var windowWidth = 0;
var minBrightness = -255;
var maxBrightness = 255;
var valBrightness = 0;
var minContrast = 0;
var maxContrast = 255;
var valContrast = 0;
var isContextMenuOpened = 0;

var measureDataForSave = new Object();
var isDuplicateCall = 0;
var cageWidthData = [];

var isCallFromUpdateMeasureData = 0;
var updatedMeasureId = 0;
var lineThickness;
var isInRotateAngleClickBox = 0;
var isPendingDrawMeasure = 0;
var isPendingDrawRequest = '';
var isPendingDrawRequestForSingle = 0;
var isPendingDrawRequestForSingleMeasure = '';
var userClickCount = 0;

//For SA Rod
var T1 = 19;
var T2 = 18;
var T3 = 17;
var T4 = 16;
var T5 = 15;
var T6 = 14;
var T7 = 13;
var T8 = 12;
var T9 = 11;
var T10 = 10;
var T11 = 9;
var T12 = 8;
var L1 = 7;
var L2 = 6;
var L3 = 5;
var L4 = 4;
var L5 = 3;
var S1 = 2;
var S2 = 1;

//measure_function.js
//Sagittal Rod Coefficients

//Lumbar Vertebra length Coeff
var L1SupLengthCoeff = 1.0;
var L1InfLengthCoeff = 0.85;
var L2SupLengthCoeff = 0.81;
var L2InfLengthCoeff = 0.66;
var L3SupLengthCoeff = 0.62;
var L3InfLengthCoeff = 0.46;
var L4SupLengthCoeff = 0.42;
var L4InfLengthCoeff = 0.26;
var L5SupLengthCoeff = 0.21;
var L5InfLengthCoeff = 0.05;

//Lumbar Vertebra Width Coeff
var L1SupWidthCoeff = 0.1821;
var L1InfWidthCoeff = 0.1865;
var L2SupWidthCoeff = 0.1868;
var L2InfWidthCoeff = 0.1918;
var L3SupWidthCoeff = 0.1933;
var L3InfWidthCoeff = 0.1961;
var L4SupWidthCoeff = 0.1967;
var L4InfWidthCoeff = 0.1983;
var L5SupWidthCoeff = 0.1981;
var L5InfWidthCoeff = 0.1980;
var S1SupWidthCoeff = 0.1967;

//Thorasic Vertebra length Coeff
var T1SupLengthCoeff = 1.0;
var T1InfLengthCoeff = 0.95;
var T2SupLengthCoeff = 0.93;
var T2InfLengthCoeff = 0.88;
var T3SupLengthCoeff = 0.87;
var T3InfLengthCoeff = 0.81;
var T4SupLengthCoeff = 0.79;
var T4InfLengthCoeff = 0.73;
var T5SupLengthCoeff = 0.72;
var T5InfLengthCoeff = 0.66;
var T6SupLengthCoeff = 0.64;
var T6InfLengthCoeff = 0.58;
var T7SupLengthCoeff = 0.56;
var T7InfLengthCoeff = 0.49;
var T8SupLengthCoeff = 0.48;
var T8InfLengthCoeff = 0.41;
var T9SupLengthCoeff = 0.40;
var T9InfLengthCoeff = 0.32;
var T10SupLengthCoeff = 0.31;
var T10InfLengthCoeff = 0.23;
var T11SupLengthCoeff = 0.21;
var T11InfLengthCoeff = 0.13;
var T12SupLengthCoeff = 0.11;
var T12InfLengthCoeff = 0.02;

// Lumbar Vertebra width Coeff
var T1SupWidthCoeff = 0.0621;
var T1InfWidthCoeff = 0.0658;
var T2SupWidthCoeff = 0.0671;
var T2InfWidthCoeff = 0.0712;
var T3SupWidthCoeff = 0.0725;
var T3InfWidthCoeff = 0.0765;
var T4SupWidthCoeff = 0.0776;
var T4InfWidthCoeff = 0.0814;
var T5SupWidthCoeff = 0.0823;
var T5InfWidthCoeff = 0.0860;
var T6SupWidthCoeff = 0.0870;
var T6InfWidthCoeff = 0.0911;
var T7SupWidthCoeff = 0.0920;
var T7InfWidthCoeff = 0.0957;
var T8SupWidthCoeff = 0.0966;
var T8InfWidthCoeff = 0.0995;
var T9SupWidthCoeff = 0.1000;
var T9InfWidthCoeff = 0.1025;
var T10SupWidthCoeff = 0.1028;
var T10InfWidthCoeff = 0.1048;
var T11SupWidthCoeff = 0.1052;
var T11InfWidthCoeff = 0.1070;
var T12SupWidthCoeff = 0.1074;
var T12InfWidthCoeff = 0.1094;

//Cervical Vertebra length Coeff
var C3SupLengthCoeff = 0.97;
var C3InfLengthCoeff = 0.82;
var C4SupLengthCoeff = 0.79;
var C4InfLengthCoeff = 0.63;
var C5SupLengthCoeff = 0.60;
var C5InfLengthCoeff = 0.43;
var C6SupLengthCoeff = 0.40;
var C6InfLengthCoeff = 0.23;
var C7SupLengthCoeff = 0.20;
var C7InfLengthCoeff = 0.03;

//Cervical Vertebra width Coeff
var C3SupWidthCoeff = 0.1641;
var C3InfWidthCoeff = 0.1776;
var C4SupWidthCoeff = 0.1700;
var C4InfWidthCoeff = 0.1823;
var C5SupWidthCoeff = 0.1742;
var C5InfWidthCoeff = 0.1898;
var C6SupWidthCoeff = 0.1856;
var C6InfWidthCoeff = 0.1963;
var C7SupWidthCoeff = 0.1949;
var C7InfWidthCoeff = 0.1994;

//Thorasic vertebra Projection Coeff
var T12ProjCoeff = 0.163;
var T11ProjCoeff = 0.161;
var T10ProjCoeff = 0.158;
var T9ProjCoeff = 0.155;
var T8ProjCoeff = 0.153;
var T7ProjCoeff = 0.151;
var T6ProjCoeff = 0.150;
var T5ProjCoeff = 0.150;
var T4ProjCoeff = 0.150;
var T3ProjCoeff = 0.150;
var T2ProjCoeff = 0.139;
var T1ProjCoeff = 0.134;

//Lumbar vertebra Projection Coeff
var L5ProjCoeff = 0.272;
var L4ProjCoeff = 0.276;
var L3ProjCoeff = 0.255;
var L2ProjCoeff = 0.254;
var L1ProjCoeff = 0.256;

//Endplates vertebra Projection Coeff
var S1SupProjCoeff  = 0.253;
var L1SupProjCoeff  = 0.256;
var T1SupProjCoeff  = 0.137;
var S2TanProjCoeff  = 0.297;
var S2PerpProjCoeff = 0.240;

var isDrawingMode           = 0;
var antPost = 0;
var postAnt = 1;
var patientOrientationValue = antPost;
var dashLinePattern = [5,5];
var polygonPointsForMeasure = {};

//Apply measure
var isApplyMeasure      = 0;
var appliedMeasureId    = 0;
var appliedMeasureType  = 0;
var originalImageObj    = {};
var imagePartObj        = {};
var allMeasuresData     = [];
var appliedMeasureDetail= {};
var appliedImageData    = {};
var clippingPathDataForRef = [];
var firstPartCornerPoints = [];
var firstPartCornerPoints1 = [];
var topPoint    = {x:0, y:0};
var bottomPoint = {x:0, y:0};

var startOffsetX = 0;
var startOffsetX1 = 0;
var startOffsetY = 0;
var startOffsetY1 = 0;
var lowerZoomValue = 0.7;

//Rotate left-1, right-2
var rotateDirection = 0;
var angle90 = 90;
var degreeValForRotate = 0;

var offsetMeasureTextArea = 10;
var intialMeasureTextOffsetXY = 10;
var defaultMeasureHandleColor = '#ff00ff';
var xOffsetForImagePart = 0;
var yOffsetForImagePart = 0;

var xOffsetForImagePartWithoutRotate = 0;
var yOffsetForImagePartWithoutRotate = 0;

var xOffsetWithApplyRotate = 0;
var yOffsetWithApplyRotate = 0;

var clippingPathDataForCage = [];
var drawthickness = 2;

//NuVasive Cage size variables
var ahList = [10.008, 11.989, 13.995, 16.002, 18.009, 19.99, 10.008, 11.989, 13.995, 16.002, 18.009, 19.99, 14.459,
    16.466, 18.472, 20.454, 22.435, 18.858, 20.864, 22.871, 24.852, 26.833, 10.008, 11.989, 13.995, 16.002, 18.009,
    19.99, 11.989, 13.995, 16.002, 18.009, 19.99, 15.865, 17.872, 19.879, 21.86, 23.841, 20.995, 23.001, 25.008, 26.989,
    28.97,10.058, 11.049, 12.065, 13.056, 14.046, 15.062, 16.053, 10.82, 11.811, 12.827, 13.818, 14.808, 15.824, 16.815,
    11.506, 13.513, 15.494, 10.846, 11.836, 12.852, 13.843, 14.834, 15.85, 16.84, 12.014, 13.005, 14.021, 15.011, 16.002,
    17.018, 18.009, 13.03, 15.037, 17.018,9.642, 11.648, 13.655, 15.662,10.058, 12.065, 14.072, 16.078, 10.6746, 12.67526,
    14.6878, 16.6944, 11.30275, 13.358, 15.385, 17.391, 8, 10, 12, 14, 8, 10, 12, 14, 9.55, 11.557, 13.538, 11.074, 13.081,
    15.062, 12.624, 14.63, 9.728, 11.735, 13.716, 11.455, 13.462, 15.443, 13.183, 15.189, 6, 8, 10, 12, 8, 10, 12, 14, 16,
    8, 10, 12, 14, 16, 8, 10, 12, 14, 16, 8, 10, 12, 14, 16, 10, 12, 14, 16, 18, 14, 16, 18, 20, 22, 8, 10, 12, 14, 16, 8,
    10, 12, 14, 16,
    8.001,8.992,10.008,10.998,11.989,13.995,9.259,10.249,11.265,12.256,13.246,15.253,8.001,8.992,10.008,10.998,11.989,13.995,
    9.539,10.53,11.546,12.536,13.527,15.534,8.001,10.008,10.998,11.989];

var phList = [6.651, 8.632, 10.638, 12.645, 14.652, 16.633, 4.962, 6.943, 8.95, 10.956, 12.963, 14.944, 5.994, 8.001,
    10.008, 11.989, 13.97, 5.994, 8.001, 10.008, 11.989, 13.97, 6.093, 8.074, 10.081, 12.087, 14.094, 16.075, 6.105,
    8.111, 10.118, 12.125, 14.106, 5.994, 8.001, 10.008, 11.989, 13.97, 5.994, 8.001, 10.008, 11.989, 13.97, 8.001,
    8.992, 10.008, 10.998, 11.989, 13.005, 13.995, 8.001, 8.992, 10.008, 10.998, 11.989, 13.005, 13.995, 8.001, 10.008,
    11.989, 8.001, 8.992, 10.008, 10.998, 11.989, 13.005, 13.995, 8.001, 8.992, 10.008, 10.998, 11.989, 13.005, 13.995,
    8.001, 10.008, 11.989, 8.001, 10.008, 12.014, 13.995, 8.001, 10.008, 12.014, 13.995, 8.001, 10.0076, 12.0142, 13.9954,
    8.001, 10.008, 12.014, 13.995,6, 8, 10, 12, 6, 8, 10, 12, 8, 10, 12, 8, 10, 12, 8, 10, 8, 10, 12, 8, 10, 12, 8, 10,
    6, 8, 10, 12, 8, 10, 12, 14, 16, 5, 7, 9, 11, 13, 8, 10, 12, 14, 16, 4, 6, 8, 10, 12, 2, 4, 6, 8, 10, 2, 4, 6, 8, 10,
    8, 10, 12, 14, 16, 3.75, 5.75, 7.75, 9.75, 11.75,
    8.001,8.992,10.008,10.998,11.989,13.995,8.001,8.992,10.008,10.998,11.989,13.995,8.001,8.992,10.008,10.998,11.989,13.995,
    8.001,8.992,10.008,10.998,11.989,13.995,8.001,10.008,10.998,11.989

];

var lordoiseList = [8, 8, 8, 8, 8, 8, 12, 12, 12, 12, 12, 12, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30,
    8, 8, 8, 8, 8, 8, 12, 12, 12, 12, 12, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30,
    4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 12, 12, 12, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8,
    8, 8, 8, 8, 12, 12, 12, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5,  5, 5, 5, 5,  8, 8, 8, 8,
    8, 8, 8, 8,  4, 4, 4, 8, 8, 8, 12, 12, 4, 4, 4, 8, 8, 8, 12, 12, 0, 0, 0, 0,  0, 0, 0,
    0, 0, 10, 10, 10, 10, 10, 0,0, 0, 0, 0, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20,
    30, 30, 30, 30, 30,  0, 0, 0, 0, 0, 10, 10, 10, 10, 10,
    0,0,0,0,0,0,8,8,8,8,8,8,0,0,0,0,0,0,8,8,8,8,8,8,0,0,0,0];

var associatedFootPrintList = ['8', '8', '8', '8', '8', '8', '12', '12', '12', '12', '12', '12', '20', '20', '20', '20',
    '20', '30', '30', '30', '30', '30','8', '8', '8', '8', '8', '8', '12', '12', '12', '12', '12', '20', '20', '20', '20',
    '20', '30', '30', '30', '30', '30', '9x23', '9x23', '9x23','9x23', '9x23', '9x23', '9x23', '9x23', '9x23', '9x23',
    '9x23', '9x23', '9x23', '9x23', '9x23', '9x23', '9x23','9x28', '9x28', '9x28', '9x28', '9x28', '9x28', '9x28', '9x28',
    '9x28', '9x28', '9x28', '9x28', '9x28', '9x28','9x28', '9x28', '9x28',  '10x25mm', '10x25mm', '10x25mm', '10x25mm',
    '10x30mm', '10x30mm', '10x30mm', '10x30mm',  '10x35mm', '10x35mm', '10x35mm', '10x35mm', '10x40mm', '10x40mm',
    '10x40mm', '10x40mm',  '9x25mm',  '9x25mm', '9x25mm', '9x25mm', '11x25mm', '11x25mm', '11x25mm', '11x25mm', '34x24',
    '34x24', '34x24', '34x24', '34x24', '34x24', '34x24', '34x24', '38x28', '38x28', '38x28', '38x28',
    '38x28', '38x28', '38x28', '38x28', '16 mm', '16 mm', '16 mm', '16 mm' , '18 mm', '18 mm', '18 mm', '18 mm',
    '18 mm', '18 mm', '18 mm', '18 mm', '18 mm', '18 mm' , '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm',
    '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm',
    '22 mm', '22 mm',  '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm',
    '8.001', '8.992', '10.008', '10.998', '11.989', '13.995', '8.001', '8.992', '10.008', '10.998', '11.989',
    '13.995', '8.001', '8.992', '10.008', '10.998', '11.989', '13.995', '8.001', '8.992', '10.008', '10.998',
    '11.989', '13.995', '8.001', '10.008', '10.998', '11.989'

];

var footPrintList = ['34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm',
    '34x24mm','34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm',
    '34x24mm', '34x24mm', '34x24mm','38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm',
    '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm', '38x28mm',
    '38x28mm', '38x28mm', '38x28mm', '38x28mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm',
    '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm', '9x23mm','9x28mm',
    '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm',
    '9x28mm', '9x28mm', '9x28mm', '9x28mm', '9x28mm', '10x25mm', '10x25mm', '10x25mm', '10x25mm', '10x30mm',
    '10x30mm', '10x30mm', '10x30mm', '10x35mm', '10x35mm', '10x35mm', '10x35mm', '10x40mm', '10x40mm', '10x40mm',
    '10x40mm','9x25mm', '9x25mm', '9x25mm', '9x25mm', '11x25mm', '11x25mm', '11x25mm', '11x25mm', '34x24mm', '34x24mm',
    '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm', '34x24mm','38x28mm', '38x28mm', '38x28mm', '38x28mm','38x28mm',
    '38x28mm', '38x28mm', '38x28mm', '16 mm', '16 mm', '16 mm', '16 mm', '18 mm', '18 mm', '18 mm', '18 mm','18 mm',
    '18 mm', '18 mm', '18 mm', '18 mm', '18 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm',
    '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '22 mm', '26 mm',
    '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm', '26 mm'];

var m1List = ['10 mm', '12 mm', '14 mm', '16 mm', '18 mm', '20 mm', '10 mm', '12 mm', '14 mm', '16 mm', '18 mm', '20 mm', '14.5 mm',
    '16.5 mm', '18.5 mm', '20.5 mm', '22.5 mm', '19 mm', '21 mm', '23 mm', '25 mm', '27 mm', '10 mm', '12 mm', '14 mm',
    '16 mm', '18 mm', '20 mm', '12 mm', '14 mm',  '16 mm', '18 mm', '20 mm', '16 mm', '18 mm', '20 mm', '22 mm', '24 mm',
    '21 mm', '23 mm', '25 mm', '27 mm', '29 mm','10 mm', '11 mm', '12 mm', '13 mm', '14 mm',  '15 mm', '16 mm', '11 mm',
    '12 mm', '13 mm', '14 mm',  '15 mm', '16 mm', '17 mm', '11.5 mm', '13.5 mm', '15.5 mm', '11 mm', '12 mm', '13 mm', '14 mm',
    '15 mm',  '16 mm', '17 mm', '12 mm', '13 mm', '14 mm',  '15 mm', '16 mm', '17 mm', '18 mm', '13 mm', '15 mm', '17 mm',
    '9.6 mm', '11.6 mm', '13.6 mm', '15.6 mm', '10 mm', '12 mm', '14 mm', '16 mm', '10.6 mm', '12.6 mm', '14.6 mm', '16.6 mm',
    '11.3 mm', '13.3 mm', '15.3 mm', '17.3 mm', '8 mm', '10 mm', '12 mm', '14 mm', '8 mm', '10 mm', '12 mm', '14 mm',
    '9.5 mm', '11.5 mm', '13.5 mm', '11 mm', '13 mm', '15 mm', '12.5 mm', '14.5 mm','9.75 mm', '11.75 mm', '13.75 mm',
    '11.5 mm', '13.5 mm', '15.5 mm', '13 mm', '15 mm', '6 mm', '8 mm', '10 mm', '12 mm', '8 mm', '10 mm', '12 mm', '14 mm',
    '16 mm', '8 mm', '10 mm', '12 mm', '14 mm', '16 mm',  '8 mm', '10 mm', '12 mm', '14 mm', '16 mm', '8 mm', '10 mm', '12 mm',
    '14 mm', '16 mm', '10 mm', '12 mm', '14 mm', '16 mm', '18 mm', '14 mm', '16 mm', '18 mm', '20 mm', '22 mm',
    '8 mm', '10 mm', '12 mm', '14 mm', '16 mm', '8 mm', '10 mm', '12 mm', '14 mm', '16 mm',
    '8 mm', '9 mm', '10 mm', '11 mm', '12 mm', '14 mm', '9.3 mm', '10.3 mm', '11.3 mm', '12.3 mm', '13.3 mm', '15.3 mm',
    '8 mm', '9 mm', '10 mm', '11 mm', '12 mm', '14 mm', '9.3 mm', '10.3 mm', '11.3 mm', '12.3 mm', '13.3 mm', '15.3 mm',
    '8 mm', '10 mm', '11 mm', '12 mm'

];

var m2List = ['6.5 mm', '8.5 mm', '10.5 mm', '12.5 mm', '14.5 mm', '16.5 mm', '5 mm', '7 mm', '9 mm', '11 mm', '13 mm',
    '15 mm', '6 mm', '8 mm', '10 mm', '12 mm', '14 mm', '6 mm', '8 mm', '10 mm', '12 mm', '14 mm', '6 mm',
    '8 mm', '10 mm', '12 mm', '14 mm', '16 mm', '6 mm', '8 mm', '10 mm', '12 mm', '14 mm', '6 mm', '8 mm',
    '10 mm', '12 mm', '14 mm', '6 mm', '8 mm', '10 mm', '12 mm', '14 mm','8 mm', '9 mm',  '10 mm', '11 mm',
    '12 mm', '13 mm', '14 mm', '8 mm', '9 mm',  '10 mm', '11 mm', '12 mm', '13 mm', '14 mm', '8 mm', '10 mm',
    '12 mm', '8 mm', '9 mm',  '10 mm', '11 mm', '12 mm', '13 mm', '14 mm', '8 mm', '9 mm',  '10 mm', '11 mm',
    '12 mm', '13 mm', '14 mm', '8 mm', '10 mm', '12 mm', '8 mm', '10 mm', '12 mm', '14 mm','8 mm', '10 mm',
    '12 mm', '14 mm', '8 mm', '10 mm', '12 mm', '14 mm', '8 mm', '10 mm', '12 mm', '14 mm','6 mm', '8 mm',
    '10 mm', '12 mm', '6 mm', '8 mm', '10 mm', '12 mm', '8 mm', '10 mm', '12 mm', '8 mm', '10 mm', '12 mm',
    '8 mm', '10 mm', '8 mm', '10 mm', '12 mm', '8 mm', '10 mm', '12 mm', '8 mm', '10 mm', '6 mm',  '8 mm',
    '10 mm', '12 mm', '8 mm',  '10 mm', '12 mm', '14 mm', '16 mm', '5 mm', '7 mm', '9 mm', '11 mm', '13 mm',
    '8 mm',  '10 mm', '12 mm', '14 mm', '16 mm', '4 mm', '6 mm',  '8 mm', '10 mm', '12 mm', '2 mm', '4 mm',
    '6 mm',  '8 mm', '10 mm', '2 mm', '4 mm', '6 mm',  '8 mm', '10 mm', '8 mm', '10 mm', '12 mm', '14 mm',
    '16 mm', '3.75 mm', '5.75 mm', '7.75 mm', '9.75 mm', '11.75 mm',
    '8 mm', '9 mm', '10 mm', '11 mm', '12 mm', '14 mm', '8 mm', '9 mm', '10 mm', '11 mm', '12 mm', '14 mm',
    '8 mm', '9 mm', '10 mm', '11 mm', '12 mm', '14 mm', '8 mm', '9 mm', '10 mm', '11 mm', '12 mm', '14 mm',
    '8 mm', '10 mm', '11 mm', '12 mm'

];

var familyList = ['ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'PLIF', 'PLIF',
    'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF',
    'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF', 'PLIF',
    'PLIF', 'PLIF','TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF',
    'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF','TLIF', 'TLIF', 'TLIF', 'TLIF',
    'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF','XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF','XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF',
    'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF', 'TLIF'

];

var typeList = ['ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF','ALIF','ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP',
    'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP',
    'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'MP', 'LO', 'LO', 'LO', 'LO', 'LO', 'LO', 'LO', 'LO','LO',
    'LO', 'LO', 'LO', 'LO', 'LO', 'LO', 'LO', 'LC', 'LC', 'LC', 'LC', 'LC', 'LC', 'LC', 'LC', 'MLX',
    'MLX', 'MLX', 'MLX', 'MLX', 'MLX', 'MLX', 'MLX', 'MLX','MLX', 'MLX', 'MLX', 'MLX', 'MLX',
    'MLX', 'MLX','XLIF', 'XLIF', 'XLIF', 'XLIF','XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior',
    'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior',
    'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior', 'Anterior',
    'Anterior', 'Anterior', 'Anterior', 'Anterior'

];

var controllingDimensionList = ['anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior','posterior', 'posterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior','posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior','posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'center', 'center', 'center', 'center','center', 'center', 'center', 'center', 'center',
    'center', 'center', 'center', 'center', 'center','center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior'

];

var positionList = ['anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior','posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior','posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior','posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior', 'posterior',
    'posterior', 'posterior', 'posterior', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior', 'anterior',
    'anterior'

];

var prefixList = ['ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF',
    'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF', 'ALIF','ALIF',    'ALIF','ALIF','ALIF','ALIF','ALIF','ALIF',
    'ALIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF','MAS PLIF', 'MAS PLIF', 'MAS PLIF',
    'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF','MAS PLIF', 'MAS PLIF', 'MAS PLIF',
    'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF','MAS PLIF', 'MAS PLIF', 'MAS PLIF',
    'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'MAS PLIF', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO',
    'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO', 'TLIF - LO',
    'TLIF - LO', 'TLIF - LO','TLIF - LC',  'TLIF - LC',  'TLIF - LC',  'TLIF - LC',  'TLIF - LC',  'TLIF - LC',
    'TLIF - LC', 'TLIF - LC',  'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX',
    'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX', 'TLIF - MLX',
    'TLIF - MLX', 'TLIF - MLX','XLIF', 'XLIF', 'XLIF','XLIF','XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF','XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF','XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'XLIF', 'XLIF', 'XLIF', 'XLIF',
    'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior',
    'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior',
    'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior',
    'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior',
    'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior', 'TLIF - Anterior'

];

var cageSizeDimensionList = [];

var antInterSectPointForCage = {x:0, y:0};
var postInterSectPointForCage = {x:0, y:0};

var  nuVassiveCageMeasureData = {};
nuVassiveCageMeasureData.ah = ahList[0];
nuVassiveCageMeasureData.associated_footprint = associatedFootPrintList[0];
nuVassiveCageMeasureData.controlling_dimensions = controllingDimensionList[0];
nuVassiveCageMeasureData.family = familyList[0];
nuVassiveCageMeasureData.footprint = footPrintList[0];
nuVassiveCageMeasureData.lordosis = lordoiseList[0];
nuVassiveCageMeasureData.m1 = m1List[0];
nuVassiveCageMeasureData.m2 = m2List[0];
nuVassiveCageMeasureData.ph = phList[0];
nuVassiveCageMeasureData.position = positionList[0];
nuVassiveCageMeasureData.prefix = prefixList[0];
nuVassiveCageMeasureData.projection2d = 'AntPost';
nuVassiveCageMeasureData.type = typeList[0];
nuVassiveCageMeasureData.width = 24;

var isReadyForDraw = 1;
var popUpForSelectTool = 0;
var popUpForCalibrateTool = 0;

//SASpineUtility.js
var isAddControlPointsInProgress = 0;
var yOffsetForMeasureText = 3;
var offSetXYDetails = [{x:0, y:0}];

var allAppliedMeasureId = [];
var initialImageObject = [];
var allAppliedMeasureClippingPath = [];
var eventTriggerCount = 0;
var textOffsetFromMeasure = 7;

var wedgeTopBottomPointIndex = {top:2, bottom:1};
var appliedActionMeasureId = [];
var indexCount = 0;

//Canvas save image object
var drawCanvasImgObj    = {};
var imgCanvasImgObj     = {};
var oldRotateValue = -1;

//SARodUtility.js
var medicreaRodMeasureText   = 'UNiD Free Rod';
var medicreaRodMeasureColor  = '#ffe66e';
var defaultMedicreaThickness = 5.5;
var medicreaRodThickness     = 0;

var SARodPoints = [];
var SARodPosX   = 0;
var SARodPosY   = 0;
var rodData     = [
    {isAttach : 0, rodID : 0, lowerVertebra : -1, upperVertebra : -1},
    {isAttach : 0, rodID : 0, lowerVertebra : -1, upperVertebra : -1}
];

var isFromSARodModal    = 0;
var SARodThicknessLimit = {};
SARodThicknessLimit.min = 1;
SARodThicknessLimit.max = 20;