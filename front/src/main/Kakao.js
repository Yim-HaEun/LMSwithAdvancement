import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Header from "./Header";
import "../css/RegisterUser.css";
import Required from "./img/required.png";
import sample6_execDaumPostcode from "./KakaoAddress";
import girl from "../main/img/girl.png";
import Footer from "./Footer";
function Kakao(props) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const code = new URL(window.location.href).searchParams.get("code");
    
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
    const [kakaoUser, setKakaoUser] = useState({ //KakaoDTO 가져와서 다시 swithUser로  넣어줄것임
      Kemail: "",
      password: "",
      nickname:"",
    });
    const [confirmNickname, setConfirmNickname] = useState("");//nickname
    const [nickBackground, setNickBackground] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState('');
    
    const [isRegex, setIsRegex] = useState(false);
    
    const handleInputChange = (e) => {
        //e 자리값 밑에 target
        const { name, value } = e.target;
        setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
      };
   
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
      const handleInputChange1 = (e) => {
        const { value } = e.target;
        const passwordRegex = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;
        const isPasswordValid = passwordRegex.test(value);
      
        setNewUser(prevUser => ({
          ...prevUser,
          password: value,
        }));
      
        if (isPasswordValid) {
          setIsRegex(true);
        } else {
          setIsRegex(false);
        }
      };

      useEffect(() => {
        const fetchUserData = async () => {
          try {
            // 서버에 사용자 정보를 가져오는 요청
            const response = await axios.get('http://localhost:8080/kakao/kakaoregister');
            setKakaoUser(response.data); 
            console.log(kakaoUser);
          } catch (error) {
            console.error('Failed to fetch user data.', error);
          }
        };
    
        fetchUserData();
      }, []);
      
      const handleAddUser = async () => {
       
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
    
    
    return(
        <div>
        <h1 className="title">카카오로 회원가입 후 S.With을 이용해보세요.</h1>
        
     <div>
     <form>
       <div>
         <div >
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
             //onChange={handleInputChange}
             required
           />

          
         </div>
         <br />
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
           //onChange={handleInputChange}
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
             onChange={handleInputChange1}
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
};
export default Kakao;