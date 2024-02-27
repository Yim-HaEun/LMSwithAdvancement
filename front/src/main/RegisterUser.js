import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "../css/RegisterUser.css";
import Required from "./img/required.png";
import sample6_execDaumPostcode from "./KakaoAddress";
import girl from "../main/img/girl.png";
import Footer from "./Footer";

function RegisterUser() {
  const [number, setNumber] = useState(""); //보낸 난수
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);//toggle
  const [confirm, setConfirm] = useState(""); //인증 input값
  const [countTime, setCountTime] = useState("");// email 인증 3분 카운트 다운
  const [emailSent, setEmailSent] = useState(false); //인증보내기 버튼

  const [confirmNickname, setConfirmNickname] = useState("");//nickname
  const [nickBackground, setNickBackground] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState('');
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const [swithUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
    nickname: "",
    img: "",
    useraddress: "",
    user_introduction: "",
    role: "",
  });

  //이용약관
  const [allAgree, setAllAgree] = useState(false);
  const [Agreements, setAgreements] = useState({
    all: false,
    terms: false,
    personalInfo: false,
    provision: false,
    location: false,
  });

  //인증번호 유효 시간
  useEffect(()=>{
    const timer = setInterval(()=>{
      if(countTime > 0){
        setCountTime((prevTime)=>prevTime -1); //1초씩 카운트다운
      }else{
        clearInterval(timer);
      }
    },1000); //1초 단위
    return () => clearInterval(timer); //타이머 정지
  },[countTime]); //countTime이 변경될 때마다 useEffect 실행

  const formatTime = (timeInSec) =>{ //180초를 분,초 로 보여줄 것
    const minutes = Math.floor(timeInSec/60); //분
    const seconds = timeInSec % 60; //초
    return `${String(minutes).padStart(1,'0')}:${String(seconds).padStart(2,'0')}}`;
  };
  // 유효시간이 0일 때 isVisible 상태를 false로 변경
  useEffect(() => {
    if (countTime === 0) {
      setIsVisible(false);
    }
  }, [countTime]);
  const handleAgreementChange = (e) => {
    // 개별 동의
    const { name, checked } = e.target;
    setAgreements((prevAgreements) => {
      const updatedAgreements = { ...prevAgreements, [name]: checked };
  
      const allChecked = Object.values(updatedAgreements).every((value) => value === true);
  
      // 개별 동의 체크박스가 모두 체크되었을 때만 전체 동의 체크박스가 체크되도록 변경
      setAllAgree(allChecked);
  
      return updatedAgreements;
    });
  };
  
  const handleAllAgreementChange = (e) => {
    const { checked } = e.target;
  
    // 전체 동의 체크박스가 체크되었을 때만 개별 동의 체크박스들을 체크 상태로 변경
    if (checked) {
      setAgreements({
        terms: true,
        personalInfo: true,
        provision: true,
        location: true,
      });
    } else {
      setAgreements({
        terms: false,
        personalInfo: false,
        provision: false,
        location: false,
      });
    }
  
    setAllAgree(checked);
  };

  

  const handleInputChange = (e) => {
    //e 자리값 밑에 target
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/users/mail",
        swithUser,
        {
          withCredentials: true,
        }
        
      );
      setConfirm(response.data.toString());
  
      //db에 이메일이 존재하면 alert 이미 존재하는 아이디입니다. else 사용가능한 아이디입니다.
      if (response.data !== "exists") {
        setIsVisible(true);
        console.log(response.data);
        console.log("서버 응답:", response);
        console.log("ok");
        alert("인증번호가 전송되었습니다.");
        setEmailSent(true);//버튼 재전송,색상변경해주기
        setCountTime(60);//3분 카운트 시작
      } else {
        alert("이미 존재하는 아이디입니다");
        console.log(response.data);
      }
    } catch (error) {
      console.error("이메일이 부적합합니다.", error);
    }
  };

  //닉네임 중복 확인 및 길이 제약
  const handleNickname = async (e) => {
    e.preventDefault();
    const { nickname } = swithUser;
    const maxLength = 10;
    if (nickname.length > maxLength || nickname.length === 0) {
      alert(`닉네임은 ${maxLength}자 이하, 0자 이상으로 입력해주세요.`);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/users/nickname",
        swithUser,
        {
          withCredentials: true,
        }
      );

      setConfirmNickname(response.data.toString());
      console.log(response.data + " ㅎㅇ?");
      if (response.data !== "existsNick") {
        alert("사용 가능한 닉네임입니다.");
        setConfirmNickname("new");
        setNickBackground(true);//색상 변경용
      } else if (response.data === "existsNick") {
        alert("이미 존재하는 닉네임입니다.");
        setConfirmNickname("existsNick");
        setNickBackground(false);//색상 변경용
      }
    } catch (error) {
      console.error("닉네임이 부적합합니다.", error);
    }
  };

  //email
  const handleNumberChange = (e) => {
    const { value } = e.target;
    setNumber(value);
  };
  const handleConfirm = async () => {
    console.log("number:", number);
    console.log("confirm:", confirm);
    if (number === confirm) {
      alert("인증 완료, 사용가능한 이메일입니다.");
      setIsVisible(false);
      setIsButtonDisabled(true);
      // 전송한 이메일 값을 a에 담아주기
    }
    else {
      alert("인증 번호가 다릅니다.");
      console.error("인증 실패");
    }
  };

  //password
  const handleConfirmPassword = async (e) => {
    console.log("swithUser.password", swithUser.password);
    console.log("confirmPassword", confirmPassword);
    const passwordRegex =
      /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;
    if (swithUser.password === confirmPassword) {
      // Check if the password meets the regex pattern
      if (passwordRegex.test(confirmPassword)) {
        alert("비밀번호가 일치합니다.");
        setIsButtonDisabled1(true);
      } else {
        alert("비밀번호가 일치하지만 조건에 부합하지 않습니다.");
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };

  const handleAddUser = async () => {
    if (
      isButtonDisabled === true &&
      swithUser.password === confirmPassword &&
      confirmNickname === "new" &&
      allAgree === true
    ) {
      try {
        //변경된 데이터 값 저장

        const response = await axios.post(
          "http://localhost:8080/users/register",
          swithUser,
          {
            withCredentials: true,
          }
        );
        //address
        const address = document.getElementById("useraddress").value;
        setNewUser((prevUser) => ({ ...prevUser, useraddress: address }));
        setData((prevUser) => [...prevUser, response.data]);
        console.log(confirmNickname);
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      } catch (error) {
        console.error("데이터가 부적합합니다.", error);
      }
    } else if (
      isButtonDisabled === false &&
      swithUser.password !== confirmPassword
    ) {
      alert("이메일 인증을 해주세요");
    } else if (
      isButtonDisabled === true &&
      swithUser.password !== confirmPassword
    ) {
      alert("비밀번호를 확인해주세요");
    } else {
      alert("모든 인증을 확인해주세요");
      console.log(confirmNickname);
    }
  };
  //profile
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택한 파일
    const reader = new FileReader();

    reader.onloadend = () => {
      setNewUser((prevUser) => ({ ...prevUser, img: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Header />

      <br></br>
      <h1 className="title">회원가입</h1>
      <br></br>
      <h3 className="subTitle">회원가입후 S.With에 참여하세요</h3>

      <div className="container_register">
        <form className="m-5 mb-1">
          <div className="register_id ml-5">
            <div className="two">
              <h4 className="register_s_text_id">
                아이디(email)
                <img src={Required} className="required_img" />
              </h4>
            </div>

            <div style={{ position: "relative" }}>
              <input
                className="textInput"
                type="text"
                name="email"
                value={swithUser.email}
                onChange={handleInputChange}
                required
              />

              <button
                disabled={isButtonDisabled}
                onClick={handleEmail}
                className={`btn round ${emailSent? 'resend':'confirmed'}`}
                style={{
                  backgroundColor: emailSent ? "#b9eeff":  "#ffffb5",
                  width: "170px",
                  height: "50px",
                  margin: "10px",
                  marginTop: "5px",
                  borderRadius: "30px",
                  position: "absolute",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
                {isButtonDisabled ? '인증 완료' : (emailSent ? '재전송' : '이메일 인증하기')}
                
              </button>
             
            </div>
            <br />
            <div className= {isVisible ? 'visible': 'hidden'} >
              &nbsp; &nbsp; &nbsp;
              <input
                type="text"
                name="number"
                className="textInput"
                value={number}
                onChange={handleNumberChange}
              />
              <button
                
                onClick={handleConfirm}
                className="btn round"
                style={{
                  backgroundColor: "#ffffb5",
                  width: "170px",
                  height: "50px",
                  margin: "10px",
                  marginTop: "5px",
                  borderRadius: "30px",
                  position: "absolute",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
                인증 확인
              </button>
              <br/>
              <p>인증번호 유효 시간 : {formatTime(countTime)}</p>
            </div>
          </div>
          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">
                비밀번호(password)
                <img src={Required} className="required_img" />
              </h4>
              <p className="register_password_massage">
                영문자,숫자,특수문자를 포함한 8자 이상의 비밀번호
              </p>
            </div>

            <input
              className="textInput"
              type="password"
              name="password"
              value={swithUser.password}
              autoComplete="off"
              onChange={handleInputChange}
              required
            />
            <br />
            <div style={{ position: "relative" }}>
              <input
                className="textInput"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                autoComplete="off"
                onChange={handlePasswordChange}
                placeholder="비밀번호를 한번 더 입력해주세요."
              />

              <button
                disabled={isButtonDisabled1}
                onClick={handleConfirmPassword}
                className="btn round"
                style={{
                  backgroundColor: isButtonDisabled1 ? "#b9eeff":  "#ffffb5",
                  width: "170px",
                  height: "50px",
                  margin: "10px",
                  marginTop: "5px",
                  borderRadius: "30px",
                  position: "absolute",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
               
                {isButtonDisabled1 ? '비밀번호 일치' : '비밀번호 일치확인'}
              </button>
               
            </div>
          </div>

          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">
                이름(name)
                <img src={Required} className="required_img" />
              </h4>
            </div>
            <label className="m-2"></label>
            <input
              className="textInput"
              type="text"
              name="username"
              value={swithUser.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">
                닉네임(nick name)
                <img src={Required} className="required_img" />
              </h4>
            </div>
            <div style={{ position: "relative" }}>
              <input
                className="textInput"
                type="text"
                name="nickname"
                value={swithUser.nickname}
                onChange={handleInputChange}
                required
              />

              <button
                onClick={handleNickname}
                className="btn round"
                style={{
                  backgroundColor: nickBackground? "#b9eeff":"#ffffb5",
                  width: "170px",
                  height: "50px",
                  margin: "10px",
                  marginTop: "5px",
                  borderRadius: "30px",
                  position: "absolute",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
                닉네임 중복확인
              </button>
            </div>
          </div>
          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">프로필 사진(profile image)</h4>
            </div>
            <label className="m-2"></label>
            <input
              className="textInput"
              style={{ paddingTop: "7px" }}
              type="file"
              accept="image/*" // 이미지 파일만 선택할 수 있도록 지정
              name="img"
              onChange={(e) => handleImageChange(e)}
            />
            {/* 프로필 사진 미리보기를 위한 이미지 컨테이너 */}
            <div className="profile-image-container">
              {swithUser.img && (
                <img
                  src={swithUser.img}
                  alt="프로필 이미지"
                  className="profile-image"
                />
              )}
            </div>
          </div>
          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">
                주소(address)
                <img src={Required} className="required_img" />
              </h4>
            </div>

            <div style={{ position: "relative" }}>
              <input type="text" id="useraddress" className="textInput" />

              <input
                name="useraddress"
                className="btn round"
                style={{
                  backgroundColor: "#ffffb5",
                  width: "150px",
                  height: "50px",
                  margin: "10px",
                  marginTop: "5px",
                  borderRadius: "30px",
                  position: "absolute",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
                type="button"
                value="주소 찾기"
                onClick={() => sample6_execDaumPostcode({ setNewUser })}
                required
              />
            </div>
          </div>

          <div className="register_id m-3">
            <div className="two">
              <h4 className="s_text">자기소개(self introduction)</h4>
            </div>
            <label className="m-2"></label>
            <textarea
              className="textInput_intro"
              type="text"
              name="user_introduction"
              value={swithUser.user_introduction}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <input
              type="text"
              name="role"
              value={swithUser.role}
              onChange={handleInputChange}
              hidden={true}
            />
          </div>
          <br />
          <section className="agreement_section ">
            <div className={isVisible ? "visible" : "visible"}>
              <ul>
                <li className="agreement_allcheck_li">
                  <label htmlFor="agreement_allcheck">이용약관 전체동의</label>
                  <input
                    className="agreement_checkbox"
                    type="checkbox"
                    id="agreement_allcheck"
                    name="agreement_allcheck"
                    checked={allAgree}
                    onChange={handleAllAgreementChange}
                  />
                </li>
                <li>
                  <label htmlFor="agreement_terms"> 이용약관 동의 [필수]</label>
                  <input
                    className="agreement_checkbox"
                    type="checkbox"
                    id="agreement_terms"
                    name="terms"
                    required
                    checked={Agreements.terms}
                    onChange={handleAgreementChange}
                  />
                </li>
                <li>
                  <label htmlFor="agreement_personalInfo">
                    개인정보 이용 수집 동의 [필수]
                  </label>
                  <input
                    className="agreement_checkbox"
                    type="checkbox"
                    id="agreement_personalInfo"
                    name="personalInfo"
                    required
                    checked={Agreements.personalInfo}
                    onChange={handleAgreementChange}
                  />
                </li>
                <li>
                  <label htmlFor="agreement_provision">
                    개인정보 제 3자 제공 동의 [필수]
                  </label>
                  <input
                    className="agreement_checkbox"
                    type="checkbox"
                    id="agreement_provision"
                    name="provision"
                    required
                    checked={Agreements.provision}
                    onChange={handleAgreementChange}
                  />
                </li>
                <li>
                  <label htmlFor="agreement_location">
                    위치정보 동의 약관 [필수]
                  </label>
                  <input
                    className="agreement_checkbox"
                    type="checkbox"
                    id="agreement_location"
                    name="location"
                    required
                    checked={Agreements.location}
                    onChange={handleAgreementChange}
                  />
                </li>
              </ul>
            </div>
          </section>
          <br />
          <button
            onClick={handleAddUser}
            type="button"
            name="login"
            className="btn round"
            style={{
              backgroundColor: "#75ddff",
              width: "200px",
              height: "50px",
              margin: "10px",
              marginTop: "20px",
              marginBottom: "10px",
              borderRadius: "30px",
              fontFamily: "SUITE-Regular",
              fontSize: "18px",
            }}
          >
            회원가입 완료
          </button>
        </form>
       
        
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}
export default RegisterUser;