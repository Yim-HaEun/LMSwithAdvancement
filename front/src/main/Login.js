import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/LoginTest.css";
import LoginAxios from "../token/tokenAxios";
import Footer from "./Footer";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await LoginAxios.post("/users/signin", {
        email,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);
      console.log("Login successful. Token:", token);
      checkLoginStatus();
      navigate("/"); // 이동 경로 수정
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // 401 Unauthorized 에러가 발생한 경우에 대한 처리
        // 또는 에러 메시지를 사용자에게 표시할 수 있습니다.
        // setUserMessage("로그인 실패: 유저가 인증되지 않았습니다.");
      } else {
        // 다른 에러에 대한 처리
      }
    }
  };
  const checkLoginStatus = async () => {
    try {
      // 서버에 현재 인증된 사용자의 정보를 가져오는 요청을 보냅니다.
      const response = await LoginAxios.get("/users/userinfo");

      // 서버에서 반환된 사용자 정보를 가져옵니다.
      const user = response.data;

      // 사용자 정보를 상태로 업데이트합니다.
      setUserData(user);

      console.log("User info retrieved successfully:", user);
    } catch (error) {
      // 서버에서 현재 인증된 사용자의 정보를 가져오는 데 실패한 경우에 대한 처리
      if (error.response && error.response.status === 401) {
        // 또는 에러 메시지를 사용자에게 표시할 수 있습니다.
        // setUserMessage("로그인 실패: 유저가 인증되지 않았습니다.");
      } else {
        // 다른 에러에 대한 처리
      }
    }
  };
      const Rest_api_key='1d11454b9e54fe7498a59635e8d3f681' //REST API KEY
      const redirect_uri = 'http://localhost:3000/kakao/oauth' //Redirect URI
      const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
      const code = new URL(window.location.href).searchParams.get("code")

      const handleKakaoLogin = ()=>{
        window.location.href = kakaoURL
    };


  
    

  return (
    <div>
      <Header />
      <div className="wrap">
        <div className="login">
          <form
            className="LoginForm"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 className="title">로그인 후 S.With을 이용해보세요.</h1>
            <br />

            <div className="login_id">
              <h4 className="s_text">Email</h4>
              <label className=""></label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div className="login_pw">
              <h4 className="s_text">Password</h4>
              <label className=""></label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div className="loginButton">
              <button
                type="button"
                name="login"
                onClick={handleLogin}
                className="btn round"
                style={{
                  backgroundColor: "#75ddff",
                  width: "150px",
                  height: "50px",
                  margin: "20px",
                  borderRadius: "30px",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
                login
              </button>
            </div>
            <div className="login_sns">
              <button
                type="button"
                name="login"
                onClick={handleKakaoLogin}
                className="btn round"
                style={{
                  backgroundColor: "#ffffb5",
                  width: "350px",
                  height: "50px",
                  margin: "10px",
                  marginTop: "20px",
                  borderRadius: "30px",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
                카카오 로그인
              </button>

              <button
                type="button"
                name="login"
                onClick={handleLogin}
                className="btn round"
                style={{
                  backgroundColor: "#ffffb5",
                  width: "350px",
                  height: "50px",
                  margin: "10px",
                  borderRadius: "30px",
                  fontFamily: "SUITE-Regular",
                  fontSize: "18px",
                }}
              >
                Github 로그인
              </button>
            </div>
          </form>
          <br></br>
          <div className="loginButton">
            <li>
              <a href="/register">
                <button
                  type="button"
                  className="btn round"
                  style={{
                    backgroundColor: "#ffb9e4",
                    width: "350px",
                    height: "50px",
                    margin: "10px",
                    borderRadius: "30px",
                    fontFamily: "SUITE-Regular",
                    fontSize: "18px",
                  }}
                >
                  S.With 회원가입하기
                </button>
              </a>
            </li>
            <li>
              <a href="/find">
                <button
                  type="button"
                  className="btn round"
                  style={{
                    backgroundColor: "#ffb9e4",
                    width: "350px",
                    height: "50px",
                    margin: "10px",
                    borderRadius: "30px",
                    fontFamily: "SUITE-Regular",
                    fontSize: "18px",
                  }}
                >
                  S.With 아이디/비밀번호 찾기
                </button>
              </a>
            </li>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default Login;