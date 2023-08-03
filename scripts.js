document.addEventListener("DOMContentLoaded", function() {
    const sendMessageBox = document.querySelector(".send-message-box");
    const chatHistory = document.querySelector(".chat-history");
    const startButton = document.querySelector(".start-button");
    const instructionMessages = document.querySelector(".instruction-messages");
    const instructionImage = document.querySelector(".instruction-image");
    const countdownTimer = document.querySelector(".countdown-timer");
    const timerHours = countdownTimer.querySelector(".timer-hours");
    const timerMinutes = countdownTimer.querySelector(".timer-minutes");
    const timerSeconds = countdownTimer.querySelector(".timer-seconds");
    const exitButton = document.querySelector(".exit-button");
    const skipButton = document.querySelector(".skip-button");
    const sendIcon = document.getElementById('sendIcon');

    var timerInterval;
    var currentInstructionIndex;

    startButton.style.display="none";
    skipButton.style.display="none";
    
    
    var textMain ="";
    var instructions;

    var topicScores = {};
    var timeEfficiencies = [];
    var totalGrade = 0;
    var expectedNumPrompts = 2;
    var startTime; // Declare startTime outside the startTimer function
  
    const instructionsb = [
      {
        message1: "Introduction to Robotics",
        message2: "Study 1: Robot Mechanics",
        message3: "Learn the basics of robot mechanics",
        image: "coursefiles/robotics3.png",
        duration: 20
      },
      {
        message1: "Robot Programming",
        message2: "Study 2: Robot Programming",
        message3: "Explore different programming techniques for robots",
        image: "coursefiles/neugpt.mp4",
        duration: 20
      },
      {
        message1: "Quiz: Robotics",
        message2: "Test your knowledge on robotics",
        message3: "What is the role of sensors in robotics?",
        image: "coursefiles/robotics2.png",
        duration: 20
      }
    ];

    
    
    
    
    
    
    
  
// FETCH INSTRUCTIONS
function fetchInstructions(mtopicId, mcourseId) {
    $.ajax({
      url: 'https://neu-ai-instructor.aiiot.website/api.php',
      method: 'POST',
      data: { topicId: mtopicId, courseId: mcourseId, action: 'fetchInstructions' },
      //dataType: 'json',
      success: function(response) {
        instructions = response;
        console.log('Fetched instructions:', instructions);
        startButton.style.display = "block";
        skipButton.style.display = "block";
        const submitButton = document.getElementById("my-submit-button");
        if(submitButton){
          submitButton.remove();
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Failed to fetch instructions:', errorThrown);
      }
    });
  }
  
//instructions =  JSON.parse(sessionStorage.getItem('Instructions'));
//fetchInstructions(sessionStorage.getItem('topicToLearn')); 

const setButton = document.querySelector(".set-button");    

setButton.addEventListener("click", function() {
// Set the instructions variable to the retrieved value
const submitButton = document.getElementById('my-submit-button');
if(submitButton){submitButton.style.display="none";}
fetchInstructions(sessionStorage.getItem('topicToLearn'), sessionStorage.getItem('courseToLearn')); 
clearInterval(timerInterval);
sessionStorage.setItem('currentInstructionIndex',0);
startButton.disabled = false;
if(submitButton){
  submitButton.style.display="none";
}
// Use the instructions variable as needed
console.log('INSTRUCTIONS FETCH ON SET: ',instructions);
}); 



        // Mock GPT responses with random ipsum text
        const responses = {
          "Hi": "Hi. How may I help you?",
          "What is robotics?": "Robotics is the branch of technology that deals with the design, construction, operation, and application of robots. It involves various fields such as mechanical engineering, electrical engineering, computer science, and artificial intelligence.",
          "What are robot mechanics?": "Robot mechanics refers to the design and study of the physical structure, components, and mechanisms used in robots. It involves concepts such as kinematics, dynamics, actuators, sensors, and motion control.",
          "What is robot programming?": "Robot programming involves writing instructions or code to control the behavior and actions of robots. It can include programming languages, robot-specific software, and algorithms for tasks such as navigation, manipulation, and decision-making.",
          "How do robots perceive their environment?": "Robots perceive their environment through various sensors such as cameras, LiDAR, ultrasonic sensors, proximity sensors, and tactile sensors. These sensors provide feedback on the robot's surroundings, enabling it to make decisions and interact with the environment.",
          "What is the role of artificial intelligence in robotics?": "Artificial intelligence plays a significant role in robotics by enabling robots to perceive, learn, reason, and make decisions. AI techniques such as machine learning, computer vision, and natural language processing enhance the capabilities of robots and enable them to adapt to changing situations.",
          "What are some applications of robotics?": "Robotics has applications in various fields, including industrial automation, healthcare, agriculture, space exploration, entertainment, and education. Robots are used for tasks such as manufacturing, surgery, exploration, companionship, and education.",
          "How can I get started with robotics?": "To get started with robotics, you can begin by learning the basics of electronics, programming, and mechanical systems. Familiarize yourself with popular robotics platforms and start experimenting with simple projects. Join robotics clubs, attend workshops, and explore online resources to deepen your knowledge and skills.",
          "What are some challenges in robotics?": "Some challenges in robotics include designing robots that can operate in unstructured environments, developing robust and efficient control algorithms, achieving human-like dexterity and perception, ensuring safety and ethical considerations, and integrating robots into existing systems and workflows.",
          "What are the types of robots?": "There are various types of robots, including industrial robots used in manufacturing, service robots for tasks like cleaning and caregiving, humanoid robots designed to resemble humans, autonomous drones used for aerial surveillance or delivery, and educational robots for learning purposes.",
          "What is the difference between a robot and an android?": "A robot is a general term for a machine that can carry out tasks autonomously or under remote control. An android specifically refers to a robot designed to resemble a human in appearance and behavior.",
          "What is the role of sensors in robotics?": " 60 Sensors play a crucial role in robotics by providing robots with information about their surroundings. Sensors such as proximity sensors, accelerometers, gyroscopes, and vision sensors enable robots to perceive objects, navigate obstacles, and interact with the environment.",
          "What is inverse kinematics in robot motion control?": "Inverse kinematics is a technique used in robot motion control to determine the joint configurations required to achieve a desired end-effector position or trajectory. It involves solving mathematical equations to find the joint angles or lengths that produce the desired motion.",
          "What programming languages are commonly used in robotics?": "Several programming languages are commonly used in robotics, including C++, Python, Java, and MATLAB. These languages offer a wide range of libraries, frameworks, and tools for robot programming and control.",
          "What are some ethical considerations in robotics?": "Ethical considerations in robotics include ensuring the safety and well-being of humans interacting with robots, addressing privacy concerns related to data collection by robots, defining ethical guidelines for autonomous robots, and considering the societal impact of widespread robot deployment.",
          "What is the future of robotics?": "The future of robotics holds great potential. Advancements in artificial intelligence, machine learning, and robotics are expected to lead to more capable and versatile robots. We may see increased integration of robots in various industries, advancements in human-robot collaboration, and the emergence of new applications we can't yet imagine.",
          "How do robots learn and adapt?": "Robots can learn and adapt through techniques such as machine learning and reinforcement learning. By training on large datasets or through interaction with the environment, robots can improve their performance, acquire new skills, and adapt to different tasks and scenarios.",
          "What are the safety considerations when working with robots?": "Safety considerations when working with robots include implementing proper guarding and protective measures to prevent accidents, ensuring clear and comprehensive safety protocols, and designing robots with built-in safety features such as collision detection and emergency stop mechanisms.",
          "How can robots be used in healthcare?": "Robots have various applications in healthcare, including surgical robots for precise and minimally invasive procedures, robotic exoskeletons for rehabilitation, telepresence robots for remote patient monitoring and consultation, and assistive robots for tasks like lifting and patient care.",
        };       
       


    currentInstructionIndex = sessionStorage.getItem('currentInstructionIndex');
    let currentInstruction;
  
    // Function to generate a response based on the prompt
    function generateResponse_Mock(prompt) {
        let maxMatchCount = 0;
        let bestMatchResponse = "I did not understand your request. Please try again.";
      
        // Iterate over each key in the responses object
        for (const key in responses) {
          const keywords = key.split(" ");
          let matchCount = 0;
      
          // Count the number of keywords that match the prompt
          for (const keyword of keywords) {
            if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
              matchCount++;
            }
          }
      
          // Update the best match if the current key has more matches
          if (matchCount > maxMatchCount) {
            maxMatchCount = matchCount;
            bestMatchResponse = responses[key];
          }
        }
      
        return bestMatchResponse;
      }
      
  
// GENERATE RESPONSE RAPID API
async function generateResponse(prompt) {
    const url = 'https://chatgpt-api8.p.rapidapi.com/';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'X-RapidAPI-Key': 'ea727bfbf4msh1dc00b8277e3c7dp196e01jsn3aa17795fe37',
        //'X-RapidAPI-Key':'2d07654b7dmshb310dce780e7846p185c69jsnff765d8d92e4',
        //'X-RapidAPI-Key':'c914c23eedmshebab214eb8d9e87p131847jsn17fe2e5a5627',
        //'X-RapidAPI-Key': '1b7977a558msh55d41b0de7de7b5p120732jsne07e93e458ec',
        'X-RapidAPI-Key': '394f136122msh3869dace1ae1718p1d7b89jsn07a08fca74eb',
        //'X-RapidAPI-Key': '13d6b48bc0msh1e618f5a046f273p1c3c6cjsnefa28abb9a85',
        'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
      },
      body: JSON.stringify([
        {
          content: prompt,
          role: 'user'
        }
      ])
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      return result.text || result.message;
    } catch (error) {
      console.error(error);
      return "Failed";
    }
  }

// GPT4ALL API
  async function generateResponse_Ola(prompt) {
    const apiUrl = `https://1181-34-143-210-26.ngrok-free.app/generate/?prompt=${encodeURIComponent(prompt)}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST'
      });
  
      const data = await response.json();
  
      if (data && data.response) {
        return data.response;
      } else {
        throw new Error('Invalid response received from the API');
      }
    } catch (error) {
      console.error('Error occurred during API request:', error);
      throw error;
    }
  }

// BARD API
  function generateResponse_BARD(prompt) {
    const apiUrl = `http://127.0.0.1:5000/?prompt=${encodeURIComponent(prompt)}`;
    console.log('API URL', apiUrl);
    return $.post(apiUrl)
      .then((data) => {
        if (data && data.output) {
          return data.output;
        } else {
          throw new Error('Invalid response received from the API');
        }
      })
      .catch((error) => {
        console.error('Error occurred during API request:', error);
        throw error;
      });
  }


//CHATGPT
async function generateResponse_chatGPT(prompt) {
  const apiKey = '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';
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    // Display the completion response
    console.log('HERE IS DATA FROM GPT: ',data.choices[0].message.content);

    // You can process the response here or display it in the HTML, etc.
    // For this example, we're just logging the output to the console.
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response:', error);
    return null;
  }
}


// EXTRACT JSON OBJECT FROM GPT RESPONSE
function extractJsonObject(text) {
  // Find the JSON object within the text
  const jsonRegex = /{[^{}]*}/g; // Regular expression to match JSON object

  const matches = text.match(jsonRegex); // Find all matches of JSON objects in the text

  if (matches && matches.length > 0) {
    // Extract the first JSON object
    const jsonString = matches[0];

    try {
      // Parse the JSON string into an object
      const jsonObject = JSON.parse(jsonString);

      // Store the parsed JSON object in sessionStorage as "scores"
      sessionStorage.setItem("scores", JSON.stringify(jsonObject));
      console.log("EXTRACTED RESULTS: ",jsonObject);

      // Return the extracted JSON object
      return jsonObject;
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  // If no JSON object is found, return null or handle the case accordingly
  return null;
}

    // Function to add a chat message to the history
    // function addChatMessage(message, isUser = false) {
    //   const chatMessage = document.createElement("div");
    //   chatMessage.className = isUser ? "user-message" : "gpt-message";
  
    //   const iconClass = isUser ? "fas fa-user" : "fas fa-robot";
    //   const iconElement = document.createElement("i");
    //   iconElement.className = iconClass;
  
    //   chatMessage.appendChild(iconElement);
  
    //   const messageText = document.createElement("p");
    //   messageText.textContent = message;
    //   chatMessage.appendChild(messageText);
  
    //   chatHistory.appendChild(chatMessage);
    //   chatHistory.scrollTop = chatHistory.scrollHeight;
    // }
  
    function addChatMessage(message, isUser = false) {
      const chatMessage = document.createElement("div");
      chatMessage.className = isUser ? "user-message" : "gpt-message";
    
      const iconClass = isUser ? "fas fa-user" : "fas fa-robot";
      const iconElement = document.createElement("i");
      iconElement.className = iconClass;
    
      chatMessage.appendChild(iconElement);
    
      const messageText = document.createElement("p");
      messageText.innerHTML = message; // Set innerHTML instead of textContent
      chatMessage.appendChild(messageText);
    
      chatHistory.appendChild(chatMessage);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  
    function isVideoLink(url) {
        // Extract the file extension from the URL
        const extension = url.split('.').pop();
      
        // Add your specific conditions for video file extensions
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv'];
      
        // Check if the file extension is in the videoExtensions array
        return videoExtensions.includes(extension.toLowerCase());
      }

// useful func to populate instructions div
function populateInstructionMessages(instruction) {
  const messageKeys = Object.keys(instruction);
  const innerHTML = '';
  for (const messageKey of messageKeys) {
    if (messageKey.startsWith('message')) {
      const message = instruction[messageKey];
      innerHTML += `<p>${message}</p>`;
    }
  }
  instructionMessages.innerHTML = innerHTML;
}


// Function to display the current instruction
function displayCurrentInstruction() {
    currentInstruction = instructions[currentInstructionIndex];
    // instructionMessages.innerHTML = `
    //   <p>${currentInstruction.message1}</p>
    //   <p>${currentInstruction.message2}</p>
    //   <p>${currentInstruction.message3}</p>
    // `;

    instructionMessages.innerHTML = '';
    const messageKeys = Object.keys(currentInstruction);
    
    for (const messageKey of messageKeys) {
      if (messageKey.startsWith('message')) {
        const message = currentInstruction[messageKey];
        instructionMessages.innerHTML += `<p>${message}</p>`;
      }
    }
    
    // const currentInstruction = instructions[currentInstructionIndex];
    // populateInstructionMessages(currentInstruction);

    instructionImage.src = currentInstruction.image;
    const instructionDuration = currentInstruction.duration;
    startTimer(instructionDuration);
  
    // Clear the media container
    chatHistory.innerHTML = "";
  
    // Check if the media URL is a video link
    if (isVideoLink(currentInstruction.image)) {
      // Create a button element for playing the video
      const playButton = document.createElement("button");
      playButton.id = "playButton";
      playButton.classList.add("btn", "btn-primary");
      
      // Create a Font Awesome icon element for the play icon
      const playIcon = document.createElement("i");
      playIcon.classList.add("fas", "fa-play");
      
      // Add the play icon to the button
      playButton.appendChild(playIcon);
      playButton.insertAdjacentHTML("beforeend", " Play Video");
      
      playButton.addEventListener("click", function() {
        // Clear the media container
        //chatHistory.innerHTML = "";
      
        // Create an iframe element for embedding the video player
        const iframe = document.createElement("iframe");
        iframe.src = currentInstruction.image;
        iframe.width = "560";
        iframe.height = "315";
      
        // Append the iframe to the media container
        chatHistory.appendChild(iframe);
      });
      
      // Append the button to the desired location
      const buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.innerHTML = "";
      buttonContainer.appendChild(playButton);
    } else {
      // Create a button element for displaying the photo
      const displayButton = document.createElement("button");
      displayButton.id = "displayButton";
      displayButton.classList.add("btn", "btn-primary");
      
      // Create a Font Awesome icon element for the image icon
      const imageIcon = document.createElement("i");
      imageIcon.classList.add("fas", "fa-image");
      
      // Add the image icon to the button
      displayButton.appendChild(imageIcon);
      displayButton.insertAdjacentHTML("beforeend", " Display Photo");
      
      displayButton.addEventListener("click", function() {
        // Create an image element
        const image = document.createElement("img");
        image.src = currentInstruction.image;
        image.style.maxWidth = "100%"; // Set the maximum width of the image to 100%
      
        // Clear the media container and append the image element
        //chatHistory.innerHTML = "";
        chatHistory.appendChild(image);
      });
      
      // Append the button to the desired location
      const buttonContainer = document.getElementById("buttonContainer");
      buttonContainer.innerHTML = "";
      buttonContainer.appendChild(displayButton);
    }
  }
  
  
  
  
    // Function to start the instruction countdown timer
    function startTimer(duration) {
      
      let timer = duration;
      let hours, minutes, seconds;
      let numPrompts = 0; // Track the number of prompts entered by the user
      textMainSetter(currentInstructionIndex);
      textBank = "";

      timerInterval = setInterval(function() {
        hours = Math.floor((timer / (60 * 60)) % 24);
        minutes = Math.floor((timer / 60) % 60);
        seconds = Math.floor(timer % 60);
  
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        seconds = seconds.toString().padStart(2, "0");
  
        timerHours.textContent = hours;
        timerMinutes.textContent = minutes;
        timerSeconds.textContent = seconds;
  
        if (--timer < 0) {
            clearInterval(timerInterval);
            sendMessageBox.querySelector("#messageTextarea").disabled = true;
    

    
            if (currentInstructionIndex === instructions.length - 1) {
              
              startButton.style.display = "block";
              startButton.disabled = true;
              skipButton.style.display="none";
              skipButton.disabled = false;
              createSubmitButton();
              
              async function callerFunction() {
                // Call the asynchronous function
                await questioner(instructions);
                console.log('Request made for questions');
                // Code here will run after the asynchronous function has completed
              }
              
              callerFunction();             
              //exitButton.style.display = "inline-block";
              // Redirect to grades page or perform necessary actions
            } else {
              startButton.textContent = "Next";
              startButton.disabled = false;

            }
          }

            
         

          
   

        }, 1000);



    // Event listener for sending messages
    sendMessageBox.addEventListener("keydown", async function(event) {
      //  && (instructions[currentInstructionIndex].message1!=='Quiz')
        if (event.key === 'Enter' && event.shiftKey || event.target === sendIcon ) {  // Enter key
          event.preventDefault(); // Prevent newline insertion
          // Add your code here to handle the event
          console.log('Shift + Enter pressed. Triggering the event...');        
          const message = event.target.value.trim();
          if (message !== "" && currentInstructionIndex <= instructions.length-2) {
            numPrompts++;
            
            addChatMessage(message, true);
            event.target.value = "";
            textBank += message + " ";

            console.log('TEXT Bank', textBank);
            console.log('TEXT Main', textMain);

                // Calculate the percentage of keywords in textMain found in textBank
                
                const keywordList = textMain.split(", ");
                const keywordCount = keywordList.filter(keyword => textBank.toLowerCase().includes(keyword.toLowerCase())).length;
                const percentage = (keywordCount / keywordList.length) * 100;

                // Update topicScores with the score
                const currentInstruction = instructions[currentInstructionIndex];
                const topic = currentInstruction.message1;
                topicScores[topic] = percentage;

                // Calculate the time usage efficiency
                const efficiency = (numPrompts / expectedNumPrompts) * 100;

                // Append the time usage efficiency to timeEfficiencies
                timeEfficiencies.push(efficiency);

                // Perform further actions with the score and efficiency
                console.log("promptEfficiency:", percentage);
                console.log("timeEfficiency:", efficiency);



    
            if (currentInstructionIndex === instructions.length - 1) {
              skipButton.style.display = 'none';
              try {
                const score = await scorer(instructions, message);
                console.log("Accuracy:", score);
                totalGrade = score;
                // Perform further actions with the score
                // make query to update grades table
                console.log("Total: ", totalGrade);
                console.log("TopicScores: ",topicScores);
                console.log("TimeEfficiencies: ",timeEfficiencies);

                // Calculate the average of topicScores values
                const topicScoreValues = Object.values(topicScores);
                const topicScoreSum = topicScoreValues.reduce((sum, score) => sum + score, 0);
                const topicScoreAverage = topicScoreSum / topicScoreValues.length;

                const keys = Object.keys(topicScores);
                const values = Object.values(topicScores);
                
                const topic = keys[0];
                const mscore = values[0];
                const total = 0.75*totalGrade + 0.125*timeEfficiencies[timeEfficiencies.length - 1] / 10 + 0.125*topicScoreAverage;
                
                const userData = JSON.parse(sessionStorage.user);
                // Access the stdnumber property
                var sid = userData.stdnumber;
                
                // Create the toDispatch object
                const toDispatch = {
                studentId: sid,
                courseId: sessionStorage.getItem('courseToLearn'),
                score: total.toFixed(2), //mscore,
                topic: topic,
                total:total.toFixed(2),
                ac: totalGrade.toFixed(2),
                te: timeEfficiencies[timeEfficiencies.length - 1] / 10,
                pe: topicScoreAverage.toFixed(2),
                action: "saveGrades"
                };

                // Send the data via jQuery Ajax
                $.ajax({
                    url: 'https://neu-ai-instructor.aiiot.website/api.php',
                    method: "POST",
                    data: toDispatch,
                    success: function(response) {
                    console.log("Grades saved successfully:", response);
                    },
                    error: function(error) {
                    console.error("Failed to save grades:", error);
                    }
                });

                 console.log('FULL DATA: ', toDispatch);   
                
                                        

              } catch (error) {
                console.error("Error:", error);
                // Handle the error
              }
            }
    
            const gptResponse = await generateResponse(message);
            addChatMessage(gptResponse);
          } 
        }
        //else{
        //   const gptResponse = "      GPT is evaluating your prompt ...";
        //   addChatMessage(gptResponse);
        // }
      });



    }
    
    // Event listener for the next button
    skipButton.addEventListener("click", function() {
      
      if (currentInstructionIndex < instructions.length - 1) {
        clearInterval(timerInterval);
        currentInstructionIndex++;
        console.log('current inst index is: ', currentInstructionIndex);
        displayCurrentInstruction();
      } else {
        
        console.log('REACHED THE END');
        
        createSubmitButton();
        skipButton.disabled=true;
        async function callerFunction() {
          // Call the asynchronous function
          await questioner(instructions);
          console.log('Request made for questions');
          // Code here will run after the asynchronous function has completed
        }
        callerFunction(); 

        //deactivate the shit + enter key so that only submit button submits answers
        sendMessageBox.addEventListener("keydown", function(event) {
          if (event.key === "Enter" && event.shiftKey) {
            // Prevent the default newline behavior
            event.preventDefault();
        
            // Disable any further processing of the key combination
            //event.stopPropagation();
        
            // Optionally, you can also disable the input field
            sendMessageBox.querySelector("#messageTextarea").disabled = true;
        
            alert('Click on submit to submit your answers');
          }
        });

        const mySubmitButton = document.getElementById('my-submit-button');
        mySubmitButton.addEventListener("click", function(){
          async function callerFunction2() {
            // Call the asynchronous function
            const messageTextarea = sendMessageBox.querySelector("#messageTextarea");
            const messageValue = messageTextarea.value;

            
            console.log("Message Value for Scoring: ",messageValue)
            const text = await masterScorer(messageValue);
            console.log('Request made for Grading');
            const jsonObject = extractJsonObject(text);
            // Code here will run after the asynchronous function has completed
            // LOGIC FOR SAVING SCORES STARTS
            try {
              const score = await scorer(instructions, messageValue);
              console.log("Accuracy:", score);
              totalGrade = score;
              // Perform further actions with the score
              // make query to update grades table
              console.log("Total: ", totalGrade);
              console.log("TopicScores: ",topicScores);
              console.log("TimeEfficiencies: ",timeEfficiencies);

              // Calculate the average of topicScores values
              const topicScoreValues = Object.values(topicScores);
              const topicScoreSum = topicScoreValues.reduce((sum, score) => sum + score, 0);
              const topicScoreAverage = topicScoreSum / topicScoreValues.length;

              const keys = Object.keys(topicScores);
              const values = Object.values(topicScores);
              
              const topic = keys[0];
              const mscore = values[0];
              const total = 0.75*totalGrade + 0.125*timeEfficiencies[timeEfficiencies.length - 1] / 10 + 0.125*topicScoreAverage;
              
              const userData = JSON.parse(sessionStorage.user);
              // Access the stdnumber property
              var sid = userData.stdnumber;
              
              // Create the toDispatch object
              const toDispatch = {
              studentId: sid,
              courseId: sessionStorage.getItem('courseToLearn'),
              score: total.toFixed(2), //mscore,
              topic: topic,
              total:total.toFixed(2),
              ac: totalGrade.toFixed(2),
              te: timeEfficiencies[timeEfficiencies.length - 1] / 10,
              pe: topicScoreAverage.toFixed(2),
              action: "saveGrades"
              };

              // Send the data via jQuery Ajax
              $.ajax({
                  url: 'https://neu-ai-instructor.aiiot.website/api.php',
                  method: "POST",
                  data: toDispatch,
                  success: function(response) {
                  console.log("Grades saved successfully:", response);
                  },
                  error: function(error) {
                  console.error("Failed to save grades:", error);
                  }
              });

               console.log('FULL DATA: ', toDispatch);   
              
                                      

            } catch (error) {
              console.error("Error:", error);
              // Handle the error
            }

            // LOGIC FOR SAVING SCORES ENDS 
          }
          
          callerFunction2(); 
        })



      }
    });
    // Event listener for the start button
    startButton.addEventListener("click", function() {
      startButton.disabled = true;
      skipButton.disabled = false;
      currentInstructionIndex = 0||parseInt(sessionStorage.getItem('currentInstructionIndex'));
      console.log('starting with index: ', currentInstructionIndex);
      displayCurrentInstruction();
      sendMessageBox.querySelector("#messageTextarea").disabled = false;
    });
  
    // Event listener for the next button
    startButton.addEventListener("click", function() {
      if (startButton.textContent === "Next") {
        loadNextInstruction();
      }
    });

    


    // Function to load the next instruction
    function loadNextInstruction() {
      currentInstructionIndex++;
      displayCurrentInstruction();
      sendMessageBox.querySelector("#messageTextarea").disabled = false;
    }
  
    // Event listener for the exit button
    // exitButton.addEventListener("click", function() {
    //   // Redirect to grades page or perform necessary actions
    // });
  
    // GENERATE RESPONSE FUNCTION
    async function scorer(instructions, prompt) {
        const lastInstruction = instructions[instructions.length - 1];
        const topic = lastInstruction.message3;
      
        // Implement the logic for the scorer function
        // that evaluates the response and returns a score
        const statement = `How accurate is the answer: ${prompt} to the question: : ${topic}? Please respond in the form: 'The answer is x% accurate' `;
        console.log('STATEMENT TO EVALUATE: ', statement);
        try {
          const response = await generateResponse(statement);
          const match = response.match(/\d+/); // Extract the number between 0 and 100
          const score = match ? parseInt(match[0]) : 0.00;
          sessionStorage.setItem("accuracy", score);
          return score;
        } catch (error) {
          console.error(error);
          return 0; // Return 0 in case of an error
        }
    }


    async function masterScorer(prompt) {
      const lastInstruction = instructions[instructions.length - 1];
      const questions = sessionStorage.getItem('questions');
    
      // Implement the logic for the scorer function
      // that evaluates the response and returns a score
      const statement = `assess the answer: ${prompt} to the following questions: ${questions}. Return ONLY the evaluation results as a json object in the form: {correctness_level:xx%, topic_relevance:yy%} where correctness_level is the correctness of both the MCQs and the free response question expressed as a percentage and topic_relevance is a rating of relevance of the answer to the free response question with respect to the subject matter.`;
      console.log('STATEMENT TO EVALUATE: ', statement);
      try {
        const response = await generateResponse(statement);
        console.log("EVALUATION RESULT: ",response);
        // const match = response.match(/\d+/); // Extract the number between 0 and 100
        // const score = match ? parseInt(match[0]) : 0.00;
        sessionStorage.setItem("scores", response);
        return response;
      } catch (error) {
        console.error(error);
        return 0; // Return 0 in case of an error
      }
  }

    async function questioner(instructions) {
      const firstInstruction = instructions[0];
      const topic = firstInstruction.message1;
    
      // Implement the logic for the scorer function
      // that evaluates the response and returns a score
      const statement = `Give me 2 MCQs and one free response question related to: ${topic}. Format the response so that it can be appended to innerHTHM`;
      console.log('STATEMENT TO EVALUATE: ', statement);
      try {
        const response = await generateResponse(statement);
        sessionStorage.setItem("questions", response);
        addChatMessage(response);
        //return response;
      } catch (error) {
        console.error(error);
        //return 'Failed to get gpt questions';
      }
  }

    async function secretPrompter(prompt) {
        const statement = "Please give me ten comma-separated keywords relevant to the topic: " + prompt;
      
        try {
          const response = await generateResponse(statement);
          textMain = response; // Assuming `textMain` is a global variable
        } catch (error) {
          console.error(error);
        }
    }


// Function to extract keywords from a message
// Function to extract keywords from a message
function extractKeywords(message) {
    // Split the message into individual words
    const words = message.split(" ");
  
    // List of common prepositions, conjunctions, and disjunctions to exclude
    const excludedWords = [
      "to", "with", "from", "in", "on", "at", "by", "for", "about", "through",
      "and", "or", "but", "nor", "so", "yet", "after", "although", "as", "because",
      "before", "if", "since", "though", "unless", "until", "when", "where", "while"
    ];
  
    // Filter out excluded words, special characters, and null values,
    // and return the remaining words as keywords
    const keywords = words.filter(word => {
      const sanitizedWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      return !excludedWords.includes(sanitizedWord) && sanitizedWord !== "" && sanitizedWord !== "null";
    });
  
    return keywords;
  }
  
  // Function to set textMain based on the current instruction
  function textMainSetter(currentIndex) {
    const currentInstruction = instructions[currentIndex];
  
    // Extract the message values dynamically
    const messages = Object.values(currentInstruction).filter(value => typeof value === 'string');
  
    // Extract important keywords from the message values
    const keywords = new Set();
  
    messages.forEach(message => {
      const messageKeywords = extractKeywords(message);
      messageKeywords.forEach(keyword => {
        keywords.add(keyword);
      });
    });
  
    // Convert the set of keywords to a comma-separated string
    textMain = Array.from(keywords).join(", ");
  
    // Log the expression to the console
    //console.log("New textMain is:", textMain);
  }
  



  });
  
  //FUNCTION TO CREAT SUBMIT BUTTON
  function createSubmitButton() {
    // Create the button element
    const submitButton = document.createElement("button");
  
    // Add classes to the button
    submitButton.classList.add("btn", "btn-primary");
  
    // Set the text of the button
    submitButton.textContent = "Submit";
    submitButton.id = "my-submit-button";
    // Get the div element with the id "submit-button"
    const submitButtonContainer = document.getElementById("submit-button");
  
    // Append the button to the div
    submitButtonContainer.appendChild(submitButton);
  }


  // FUNCTION TO DESTROY SUBMIT BUTTON
function destroySubmitButton() {
  // Get the submit button element with the id "my-submit-button"
  const submitButton = document.getElementById("my-submit-button");

  // Check if the submit button exists
  if (submitButton) {
    // If the submit button exists, remove it from the DOM
    submitButton.remove();
  }
}

  // submitButton.addEventListener("click", function() {
    
  //     clearInterval(timerInterval);
  //     startTimer(0);
    
  // });


// SCRIPT FROM HOME

   // Function to fetch courses for a specific user
   const userDatab = JSON.parse(sessionStorage.user);

   // Access the stdnumber property
   var sid = userDatab.stdnumber;
   console.log('STUDENT NUMBER IS: ',sid);


   function fetchCoursesForUser(sid) {
       $.ajax({
           url: 'https://neu-ai-instructor.aiiot.website/api.php',
           method: 'POST',
           data: { studentId: sid, action: 'fetchCoursesForUser'  },
           dataType: 'json',
           success: function(response) {
               console.log('COURSES FETCHED SUCCESSFULY', response);
               var courses=response.courses;
               console.log("FIRST COURSE NAME: ",courses[0].name);
               const courseSelect = $('#course');
                   courseSelect.empty();
                   courseSelect.append('<option value="" style="background-color:lightblue;">  Select a Course  </option>');
                   // Add options for each course
                   courses.forEach(course => {
                   const option = $('<option></option>')
                       .val(course.id)
                       .text(course.name);
                   courseSelect.append(option);
                   });

                   // Trigger change event to populate topics for the selected course
                   courseSelect.trigger('change');
                   //sessionStorage.setItem("courseToLearn",courseId);
           
           },
           error: function(jqXHR, textStatus, errorThrown) {
           console.error('Failed to fetch courses:', errorThrown);
           }
       });
   }

//FETCH TOPICS
   function fetchTopics(courseId) {
   $.ajax({
       url: 'https://neu-ai-instructor.aiiot.website/api.php',
       method: 'POST',
       data: { action: 'fetchTopicsForCourse', courseId: courseId },
       dataType: 'json',
       success: function(response) {
           console.log('TOPICS FETCHED SUCCESSFULY', response);
           const topicSelect = $('#topic');
               topicSelect.empty();

               // Add options for each topic
               topicSelect.append('<option value="" style="background-color:lightblue;">   Select Lecture  </option>')
               response.topics.forEach(topic => {
               const option = $('<option></option>')
                   .val(topic.id)
                   .text(topic.name);
               topicSelect.append(option);
               });
               sessionStorage.setItem('courseToLearn',courseId);
               //sessionStorage.setItem('topicToLearn',response.topics[0].id);
               
       
       },
       error: function(jqXHR, textStatus, errorThrown) {
       console.error('Failed to fetch TOPICS:', errorThrown);
       }
   });
   }


   function fetchCoursesForUser(sid, cdId) {
       $.ajax({
           url: 'https://neu-ai-instructor.aiiot.website/api.php',
           method: 'POST',
           data: { studentId: sid, action: 'fetchCoursesForUser'  },
           dataType: 'json',
           success: function(response) {
               console.log('COURSES FETCHED SUCCESSFULY', response);
               var courses=response.courses;
               console.log("FIRST COURSE NAME: ",courses[0].name);
               const courseSelect = $(cdId);
                   courseSelect.empty();
                   courseSelect.append('<option value="" style="background-color:lightblue;">  Select a Course  </option>');
                   // Add options for each course
                   courses.forEach(course => {
                   const option = $('<option></option>')
                       .val(course.id)
                       .text(course.name);
                   courseSelect.append(option);
                   });

                   // Trigger change event to populate topics for the selected course
                   courseSelect.trigger('change');
                   //sessionStorage.setItem("courseToLearn",courseId);
           
           },
           error: function(jqXHR, textStatus, errorThrown) {
           console.error('Failed to fetch courses:', errorThrown);
           }
       });
   }

//FETCH TOPICS
   function fetchTopics(courseId, tdId) {
   $.ajax({
       url: 'https://neu-ai-instructor.aiiot.website/api.php',
       method: 'POST',
       data: { action: 'fetchTopicsForCourse', courseId: courseId },
       dataType: 'json',
       success: function(response) {
           console.log('TOPICS FETCHED SUCCESSFULY', response);
           const topicSelect = $(tdId);
               topicSelect.empty();

               // Add options for each topic
               topicSelect.append('<option value="" style="background-color:lightblue;">   Select Lecture  </option>')
               response.topics.forEach(topic => {
               const option = $('<option></option>')
                   .val(topic.id)
                   .text(topic.name);
               topicSelect.append(option);
               });
               sessionStorage.setItem('courseToLearn',courseId);
               //sessionStorage.setItem('topicToLearn',response.topics[0].id);
               
       
       },
       error: function(jqXHR, textStatus, errorThrown) {
       console.error('Failed to fetch TOPICS:', errorThrown);
       }
   });
   }


   $(document).ready(function() {
 // Retrieve studentId from sessionStorage



 // Fetch courses for the user on page load
 fetchCoursesForUser(sid, '#course');
 fetchCoursesForUser(sid, '#courseG');

 // Handle course selection change event
 $('#course').change(function() {
           const courseId = $(this).val();
           if (courseId) {
           fetchTopics(courseId, '#topic');
           sessionStorage.setItem('courseToLearn', courseId); // Save selected course to sessionStorage
           } else {
           // Clear topic options if no course is selected
           const topicSelect = $('#topic');
           topicSelect.empty();
           sessionStorage.setItem('topicToLearn', null); 
           }
       });

       
       // Handle topic selection change event
       $('#topic').change(function() {
           const topicId = $(this).val();
           if (topicId) {
           sessionStorage.setItem('topicToLearn', topicId); // Save selected topic to sessionStorage
           
           }
       });


       $('#courseG').change(function() {
        const courseId = $(this).val();
        if (courseId) {
        fetchTopics(courseId, '#topicG');
        sessionStorage.setItem('courseToLearn', courseId); // Save selected course to sessionStorage
        } else {
        // Clear topic options if no course is selected
        const topicSelect = $('#topicG');
        topicSelect.empty();
        sessionStorage.setItem('topicToLearn', null); 
        }
    });

    
    // Handle topic selection change event
    $('#topicG').change(function() {
        const topicId = $(this).val();
        if (topicId) {
        sessionStorage.setItem('topicToLearn', topicId); // Save selected topic to sessionStorage
        
        }
    });



   });

