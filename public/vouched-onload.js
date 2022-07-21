const config = {
  appId: 'mCkayd-Ug60kFINHDEO#H@y4C@#b.5',
  callbackURL: `${process.env.API_BASE_URL}/webhook/vouched-id`,
  sandbox: true,

  type: 'idv',
  id: 'camera',
  face: 'camera',

  // your webhook for POST verification processing
  // callbackURL: "https://www.vouched.id/",

  // optional verification information for comparison
  verification: {
    firstName: "First",
    lastName: "Last",
    email: "test@test.id",
    phone: "000-111-2222",
  },

  // mobile handoff fields, a job will be created automatically if true
  crossDevice: true,
  crossDeviceQRCode: true,
  crossDeviceSMS: true,

  // have the user confirm information
  userConfirmation: {
    confirmData: true,
    confirmImages: true,
  },

  // callback during initialization of the web app
  onInit: ({ token, job }) => {
    console.log("initialization");
  },

  // callback when a user submits a photo
  onSubmit: ({ stage, attempts, job }) => {
    console.log("photo submitted");
  },

  // called when a job is completed.
  onDone: (job) => {
    // token used to query jobs
    console.log("scanning complete", { token: job.token });

    // An alternative way to update your system based on the
    // results of the job. Your backend could perform the following:
    // 1. query jobs with the token
    // 2. store relevant job information such as the id and
    //    success property into the user's profile
    // fetch(`/yourapi/idv?job_token=${job.token}`);

    // Redirect to the next page based on the job success
    // if (job.result.success) {
    //   window.location.replace("https://www.vouched.id/");
    // } else {
    //   window.location.replace("https://www.vouched.id/");
    // }
  },

  // callback executed after attempt to find camera device
  onCamera: ({ hasCamera, hasPermission }) => {
    console.log("attempted to find camera");
  },

  // callback when there are changes to the Camera DOM element
  onCameraEvent: (cameraEvent) => {
    console.log("camera DOM element updated");
  },

  // callback when a reverification job is complete
  onReverify: (job) => {
    console.log("reverification complete");
  },

  // callback when a survey is submitted, (per customer basis)
  onSurveyDone: (job) => {
    console.log("survey done");
  },

  // callback when user confirms data and photos
  onConfirm: (userConfirmEvent) => {
    console.log("user confirmation");
  },

  // theme
  theme: {
    name: "avant",
  },
};

const vouchedOnLoad = () => {
  var vouched = window["Vouched"]({ ...config });
  console.log("mount vouched-element");
  vouched.mount("#vouched-element");
};

export default vouchedOnLoad;