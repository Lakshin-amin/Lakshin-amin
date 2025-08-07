<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lakshin's Portfolio</title>
  <link rel="stylesheet" href="test.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="navbar">
    <div class="left">
      <span>Lakshin Amin - Student</span>
    </div>
    <div class="center">
      <a href="./about.html">About Me</a>
      <a href="./contact.html">Contact Me</a>
    </div>
  </div>

  <div class="main">
    <div class="client-info">
      <img class="photo" src="./media/dp.jpg" alt="Client's Photo">
      <div class="name">Lakshin Amin</div>
    </div>
  </div>

  <div class="text">
    <h1>My Qualifications</h1>
  </div>

  <div class="container">
    <div class="card">
      <div class="circle">
        <h2>University of Mumbai</h2>
      </div>
      <div class="content">
        <p>I'm currently pursuing my degree in Bachelors in Science (Computer Science) from the University of Mumbai</p>
        <a href="https://mu.ac.in/" target="_blank">Visit</a>
      </div>
    </div>
  </div>

  <div class="text">
    <h1>My Projects</h1>
  </div>

  <div class="project_card_container">
    <div class="project_card">
      <img src="./media/image01.jpg" alt="">
      <button class="project_button">Learn More</button>
    </div>
    <div class="project_card">
      <img src="./media/image1.jpg" alt="">
      <button class="project_button">Learn More</button>
    </div>
    <div class="project_card">
      <img src="./media/image2.jpg" alt="">
      <button class="project_button">Learn More</button>
    </div>
    <div class="project_card">
      <img src="./media/image3.jpg" alt="">
      <button class="project_button">Learn More</button>
    </div>
    <div class="project_card">
      <img src="./media/image4.jpg" alt="">
      <button class="project_button">Learn More</button>
    </div>
  </div>

  <footer>
    <div class="background">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="50%" height="100%" viewBox="0 0 1600 900">
        <defs>
          <linearGradient id="bg" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: rgba(0, 0, 0, 0.6)"></stop>
            <stop offset="100%" style="stop-color: rgba(38, 89, 190, 0.06)"></stop>
          </linearGradient>
          <path id="wave" fill="url(#bg)" d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
          s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"></path>
        </defs>
        <g>
          <use xlink:href="#wave" opacity=".3">
            <animateTransform attributeName="transform" attributeType="XML" type="translate"
                              dur="8s" calcMode="spline"
                              values="270 230; -334 180; 270 230" keyTimes="0; .5; 1"
                              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                              repeatCount="indefinite" />
          </use>
          <use xlink:href="#wave" opacity=".6">
            <animateTransform attributeName="transform" attributeType="XML" type="translate"
                              dur="6s" calcMode="spline"
                              values="-270 230;243 220;-270 230" keyTimes="0; .6; 1"
                              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                              repeatCount="indefinite" />
          </use>
          <use xlink:href="#wave" opacity=".9">
            <animateTransform attributeName="transform" attributeType="XML" type="translate"
                              dur="4s" calcMode="spline"
                              values="0 230;-140 200;0 230" keyTimes="0; .4; 1"
                              keySplines="0.42, 0, 0.58, 1.0;0.42, 0, 0.58, 1.0"
                              repeatCount="indefinite" />
          </use>
        </g>
      </svg>
    </div>

  <section>
      <ul class="socials">
        <li><a class="fa-brands fa-github" href="https://github.com/lakshplayz23" target="_blank"></a></li>
        <li><a class="fa-brands fa-linkedin" href="https://www.linkedin.com/in/lakshin-amin-b41168370/" target="_blank"></a></li>
        <li><a class="fa-brands fa-instagram" href="https://www.instagram.com/_itzme.laksh_07/" target="_blank"></a></li>
      </ul>

    
  <ul class="links">
        <li><a href="#">Home</a></li>
        <li><a href="./about.html">About</a></li>
        <li><a href="./contact.html">Contact</a></li>
      </ul>

  <p class="legal">© 2025 All rights reserved</p>
    </section>
  </footer>
</body>
</html>
