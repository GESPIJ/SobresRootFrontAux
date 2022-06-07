const listOfPosibleAdmins = ["Oswaldo", "Vladimir"];

export const checkIfAdminExists = (admin) => {
  return listOfPosibleAdmins.includes(admin);
};

export const convertDateToHumanReadable = (originalDate) => {
  const humanReadableDate = new Date(originalDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return humanReadableDate;
};
export const verifyIp = (e) => {
  let changedPortionLength = e.target.value.length - 1;
  let changedPortion = e.target.value[changedPortionLength];
  let prevChangedPortion = e.target.value.slice(0, changedPortionLength);
  let changedPortionPrev = e.target.value[changedPortionLength - 1];
  let prevNumberPortion = "";

  //console.log("this is the changed portion", changedPortion);
  if (changedPortion === "." || !isNaN(parseInt(changedPortion))) {
    for (let i = 0; i < 4; i++) {
      //debugger;
      if (e.target.value[changedPortionLength - i - 1] === ".") {
        if (i == 3) {
          prevNumberPortion = "123";

          break;
        } else {
          prevNumberPortion = e.target.value.slice(
            //changedPortionLength - i,
            changedPortionLength - i,
            changedPortionLength
            //changedPortionLength
          );

          break;
        }
        //debugger;
      }
      //debugger;
      //if (parseInt(prevNumberPortion)<=255 && parseInt(prevNumberPortion)>0)
    }
  }
  //prevNumberPortion = prevNumberPortion !== "" ? prevNumberPortion : "123";

  let newPortionToAdd = prevNumberPortion + changedPortion;

  //console.log("this is the prev Number Portion", prevNumberPortion);
  return (
    (!isNaN(parseInt(changedPortion)) &&
      prevNumberPortion.length <= 2 &&
      parseInt(newPortionToAdd) <= 255) ||
    (changedPortion === "." && changedPortionPrev !== ".")
  );
};

export const verifyPort = (e) => {
  let changedPortionLength = e.target.value.length;
  let changedPortion = e.target.value[changedPortionLength - 1];
  return (
    (!isNaN(parseInt(changedPortion)) && parseInt(e.target.value) <= 65535) ||
    e.target.value === ""
  );
};

export const verifyNameLastName = (e) => {
  let changedPortion = e.target.value.slice(-1);
  let asciiCode = changedPortion.charCodeAt();
  let validAscii =
    (asciiCode <= 122 && asciiCode >= 97) ||
    (asciiCode >= 65 && asciiCode <= 90);

  return (
    (isNaN(parseInt(changedPortion)) && validAscii) || changedPortion === ""
  );
};

export const validatePassword = (password) => {
  console.log(password);
  //const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  // const re = /^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/;

  //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\#!%*+?&\-\_\(\)])[A-Za-z\d@$!#+*\-\_\(\)%*?&]{8,}$/;
  return re.test(String(password));
};

export const validateEmail = (email) => {
  console.log(email);
  const re1 = /^[a-zA-z0-9\-\.\_\+\-]*@banvenez.com/;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re1.test(String(email).toLowerCase());
};
export const validateNm = (nm) => {
  let re = /[nm|ct][0-9]{6}$/;
  let re1 = /[ct][0-9]{5}$/;
  let re2 = /[nm][0-9]{5}/	
  return (
    re.test(String(nm).toLowerCase()) || re1.test(String(nm).toLowerCase()) || re2.test(String(nm).toLowerCase())
  );
};
