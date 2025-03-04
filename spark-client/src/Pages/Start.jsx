import React from 'react'
import './Start.css'
import { useNavigate } from "react-router-dom";
import logo from '../assets/sparkIcon.svg'
import analytics from '../assets/Analytics 1.svg'
import greencard1 from "../assets/greencard1.svg";
import greencard2 from "../assets/greencard2.svg";
import greencard3 from "../assets/greencard3.svg";           
import greencard4 from "../assets/greencard4.svg";
import greencard5 from "../assets/greencard5.svg";
import square from "../assets/square01.webp.png";
import square1 from "../assets/square02.webp.png";
import square2 from "../assets/wide01.webp.png";

const Start = () => {
    const navigate = useNavigate();

    const testimonials = [
        {
          text: "Amazing tool! Saved me months",
          description:
            "This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.",
          author: "John Master",
          position: "Director, Spark.com",
        },
        {
          text: "Amazing tool! Saved me months",
          description:
            "This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.",
          author: "John Master",
          position: "Director, Spark.com",
        },
        {
          text: "Amazing tool! Saved me months",
          description:
            "This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.",
          author: "John Master",
          position: "Director, Spark.com",
        },
        {
          text: "Amazing tool! Saved me months",
          description:
            "This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.",
          author: "John Master",
          position: "Director, Spark.com",
        },
      ];
      
      const integrations = [
        { name: "Audiomack", description: "Add an Audiomack player to your Linktree" },
        { name: "Bandsintown", description: "Drive ticket sales by listing your events" },
        { name: "Bonfire", description: "Display and sell your custom merch" },
        { name: "Books", description: "Promote books on your Linktree" },
        { name: "Buy Me A Gift", description: "Let visitors support you with a small gift" },
        { name: "Cameo", description: "Make impossible fan connections possible" },
        { name: "Clubhouse", description: "Let your community in on the conversation" },
        { name: "Community", description: "Build an SMS subscriber list" },
        { name: "Contact Details", description: "Easily share downloadable contact details" },
      ];



  return (
    <>
        <div className="container-start">
      <header className="header-start">
        <div className="logo-start">
            <img style={{width:"32px"}} src={logo} alt="" />
            <b>SPARK</b>| Marketplace</div>
        <button className="signup-start" onClick={() => navigate("/signup")}>Sign Up Free</button>
      </header>
      <section className="hero">
        <div className="hero-text">
          <h1 style={{ lineHeight:'70px', fontSize:"56px",margin:"0px"}}>The easiest place to update and share your Connection</h1>
          <p style={{fontSize:"20px", width:"70%"}}>
            Help your followers discover everything you’re sharing over the
            internet, in one simple place. They’ll thank you for it!
          </p>
          <button className="cta" onClick={() => navigate("/signup")}>Get Your Free Spark</button>
        </div>
        <div className="hero-image">
            <img style={{width:"694px", height:"490px"}} src={analytics} alt="" />
        </div>
      </section>
      <section className="analytics">
        <div className="card" style={{padding:"40px",gridColumn:"span 2"}}>
            <div style={{display:"flex", justifyContent:"center"}}>
                <img  src={greencard1} alt="" />
                <img style={{marginLeft:"-50px",width:"132.95px"}} src={greencard2} alt="" />
                <img style={{marginLeft:"-50px",width:"132.95px"}} src={greencard3} alt="" />
                <img style={{marginLeft:"-50px",width:"132.95px"}} src={greencard4} alt="" />
                <img style={{marginLeft:"-50px",width:"132.95px"}} src={greencard5} alt="" />
            </div>
            
          <p style={{fontFamily:"poppins",fontSize:"26px"}}>Sell products and collect payments. It’s monetization made simple.</p>
        </div>
        <div style={{display:"flex",alignItems:"center"}}>
            <div>
          <h2 style={{fontSize:"30px",margin:"0px"}}>Analyze your audience and keep your followers engaged</h2>
          <p>
            Track your engagement and see how your audience interacts with your
            content.
          </p>
          </div>
        </div>
      </section>

   

      <section className="analytics">
        <div className='content-section' style={{display:"flex",alignItems:"center"}}>
            <div >
                <div></div>
            <h2>Share limitless content in limitless ways</h2>
        <p>
          Connect your content hub with the highest form of freedom. Share
          images, links, and more in one convenient place.
        </p>
            </div>
        
        </div>
        <div className="content-preview"> 
            <div style={{display:"flex",flexWrap:"nowrap",justifyContent:"space-around", padding:"20px"}}>
                <div><img src={square} alt="" /></div>
                <div><img src={square1} alt="" /></div>
                <div><img src={square2} alt="" /></div>
            </div> 
          <h3>Share limitless content in limitless ways <br />on your Spark</h3>
        </div>
      </section>
   
     <section>
         <div style={{display:"flex", justifyContent:"space-between",margin:"30px 0px"}}>
            <div style={{fontSize:"48px",}}><p style={{margin:"0px"}}>Here’s what our <span style={{color:"#1DA35E"}}>customer</span><br /> has to say</p></div>
            <div>
                <span>
                    <img src="" alt="" />
                </span>
                <p style={{margin:"0px",fontSize:"small"}}>
                [short description goes in here] lorem <br /> ipsum is a placeholder text to <br /> demonstrate.</p></div>
         </div>
         <span style={{border:"2px solid #1DA35E" 
            ,borderRadius:"25px",
            color:"#1DA35E",
            padding:"12px 24px"}}>Read Customer Story</span>
     </section>


     <section className="testimonials">
        {testimonials.map((item, index) => (
          <div key={index} className="testimonial-card">
            <h3>{item.text}</h3>
            <p>{item.description}</p>
            <div className="author">
              <span className="avatar" />
              <div>
                <strong>{item.author}</strong>
                <p>{item.position}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="integrations">
        <h2>All Link Apps and Integrations</h2>
        <div className="integration-list">
          {integrations.map((item, index) => (
            <div key={index} className="integration-card">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="footer">
        <div className="footer-buttons">
          <button className="login">Log in</button>
          <button className="signup" onClick={() => navigate("/signup")}>Sign up free</button>
        </div>
        <div className="footer-links">
          <div>
            <h5>About Spark</h5>
            <ul>
              <li>Blog</li>
              <li>Press</li>
              <li>Social Good</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h5>Careers</h5>
            <ul>
              <li>Getting Started</li>
              <li>Features and How-Tos</li>
              <li>FAQs</li>
              <li>Report a Violation</li>
            </ul>
          </div>
          <div>
            <h5>Terms and Policies</h5>
            <ul>
              <li>Terms and Conditions</li>
              <li>Privacy Policy</li>
              <li>Cookie Notice</li>
              <li>Trust Center</li>
            </ul>
          </div>
        </div>
        <p className="acknowledgment">
          We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri people of the Kulin Nation, and pay our respects to Elders past, present and emerging.
        </p>
        <div className="social-icons">
          <span>🐦</span>
          <span>📷</span>
          <span>🎥</span>
          <span>🎵</span>
          <span>🔥</span>
        </div>
      </footer>

    </div>
    </>
  )
}

export default Start