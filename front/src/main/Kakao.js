import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
function Kakao(props) {
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        const kakaoLogin = async () => {
          await axios({
            method: "GET",
            url: `${process.env.REACT_APP_REDIRECT_URL}/?code=${code}`,
            headers: {
              "Content-Type": "application/json;charset=utf-8", //json형태로 데이터를 보냄
              "Access-Control-Allow-Origin": "*", //cors 에러
            },
          }).then((res) => { //백에서 완료후 우리사이트 전용 토큰 넘겨주는게 성공했다면
            console.log(res);
            //계속 쓸 정보들( ex: 이름) 등은 localStorage에 저장해두자
            localStorage.setItem("name", res.data.account.kakaoName);
            //로그인이 성공하면 이동할 페이지
            navigate("/");
          });
        };
        kakaoLogin();
      }, [props.history]);
    return(
<div>
<h1 className="title">카카오로 회원가입 후 S.With을 이용해보세요.</h1>
</div>
    );
};
export default Kakao;