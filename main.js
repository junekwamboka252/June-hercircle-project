document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded.");

    // =============================
    // === Audience Toggle Logic ===
    // =============================
    const studentsButton = document.getElementById('toggleStudents');
    const mentorsButton = document.getElementById('toggleMentors');
    const studentsContent = document.getElementById('studentsContent');
    const mentorsContent = document.getElementById('mentorsContent');
    const toggleContainer = document.querySelector('.toggle-switch-container');

    function showAudienceContent(audienceType) {
        if (!studentsButton || !mentorsButton || !studentsContent || !mentorsContent || !toggleContainer) {
            console.error("One or more toggle elements not found. Check your IDs.");
            return;
        }

        const hideDelay = 150;

        const hideContentSmoothly = (element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.style.visibility = 'hidden';
                element.hidden = true;
            }, hideDelay);
        };

        const showContentSmoothly = (element) => {
            element.hidden = false;
            element.style.visibility = 'visible';
            element.offsetHeight; // Force reflow
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        };

        // Toggle classes
        if (audienceType === 'students') {
            toggleContainer.classList.add('students-active');
            toggleContainer.classList.remove('mentors-active');
            studentsButton.classList.add('active');
            mentorsButton.classList.remove('active');
            studentsButton.setAttribute('aria-selected', 'true');
            mentorsButton.setAttribute('aria-selected', 'false');
        } else if (audienceType === 'mentors') {
            toggleContainer.classList.add('mentors-active');
            toggleContainer.classList.remove('students-active');
            mentorsButton.classList.add('active');
            studentsButton.classList.remove('active');
            studentsButton.setAttribute('aria-selected', 'false');
            mentorsButton.setAttribute('aria-selected', 'true');
        }

        // Hide and show content smoothly
        if (!studentsContent.hidden) hideContentSmoothly(studentsContent);
        if (!mentorsContent.hidden) hideContentSmoothly(mentorsContent);

        setTimeout(() => {
            if (audienceType === 'students') {
                showContentSmoothly(studentsContent);
            } else if (audienceType === 'mentors') {
                showContentSmoothly(mentorsContent);
            }
        }, hideDelay);
    }

    // Event Listeners
    if (studentsButton) {
        studentsButton.addEventListener('click', () => {
            if (!studentsButton.classList.contains('active')) {
                showAudienceContent('students');
            }
        });
    } else {
        console.error("Students toggle button not found. Check ID 'toggleStudents'.");
    }

    if (mentorsButton) {
        mentorsButton.addEventListener('click', () => {
            if (!mentorsButton.classList.contains('active')) {
                showAudienceContent('mentors');
            }
        });
    } else {
        console.error("Mentors toggle button not found. Check ID 'toggleMentors'.");
    }

    // Default to students
    setTimeout(() => {
        showAudienceContent('students');
    }, 100);

    // ========================
    // === FAQ Toggle Logic ===
    // ========================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(i => {
                    if (i !== item) i.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });

    // =========================
    // === Chatbot Handling ===
    // =========================
    const chatDisplay = document.querySelector('.chat-display');
    const chatInputField = document.querySelector('.chat-input-field');
    const chatSendButton = document.querySelector('.chat-send-button');
    const typingIndicator = document.querySelector('.typing-indicator');

    // Initialize chat history
    let chatHistory = [
        {
            role: "system",
            content: `You are HerCircle AI, a helpful and empathetic assistant for HerCircle. HerCircle is a safe and inclusive online community for women.
We provide a nurturing space where women can share, learn, and grow together through empowerment workshops, mentorships, and a resource hub.
Our mission is to empower women to build strong, supportive communities that celebrate every voice and story, so no woman ever feels alone on her journey.
We envision a world where every woman has a safe, uplifting space to connect, grow, and thrive — a sisterhood that transcends borders and empowers women to lead with confidence and compassion.
Key products include HerCircle Empowerment Workshops, HerCircle Connect, and HerCircle Resource Hub.

**founder's name is june kwamboka.**`
        }
    ];

    // Add message to display
    function addMessage(message, sender) {
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('chat-bubble', sender === 'user' ? 'user-message' : 'bot-message');
        bubbleDiv.innerHTML = `<p>${message}</p>`;
        chatDisplay.appendChild(bubbleDiv);
        scrollToBottom();
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Enable/disable UI
    function setChatUIEnabled(enabled) {
        chatInputField.disabled = !enabled;
        chatSendButton.disabled = !enabled;
        if (enabled) {
            chatInputField.focus();
            console.log("Chat UI enabled.");
        } else {
            console.log("Chat UI disabled.");
        }
    }

    // Send message to AI
    async function sendMessage() {
        const userMessage = chatInputField.value.trim();
        if (!userMessage) {
            console.log("User message is empty.");
            return;
        }

        addMessage(userMessage, 'user');
        chatHistory.push({ role: "user", content: userMessage });
        chatInputField.value = '';
        setChatUIEnabled(false);
        typingIndicator.style.display = 'block';
        scrollToBottom();

        console.log("Sending chatHistory:", chatHistory, Array.isArray(chatHistory));
                     typingIndicator.style.display = 'block';


        try {
            // Adjust depending on your actual API — for example:
            // const response = await puter.ai.chat({ model: "gpt-4o", messages: chatHistory });
            /*const response = await puter.ai.chat({
                messages: chatHistory
            });*/
             typingIndicator.style.display = 'block';
            const response= await puter.ai.chat(chatHistory);

            const botResponse = response?.message?.content || "Sorry, I didn't get a response.";
            addMessage(botResponse, 'bot');
            chatHistory.push({ role: "assistant", content: botResponse });
        } catch (error) {
            console.error("Error communicating with Puter AI:", error);
            typingIndicator.style.display = 'none';
            addMessage("Oops! I'm having trouble connecting right now. Please try again later.", 'bot');
        } finally {
            setChatUIEnabled(true);
        }
    }

    // Event Listeners for send button and Enter key
    if (chatSendButton) {
        chatSendButton.addEventListener('click', sendMessage);
    } else {
        console.error("Chat send button not found. Check class 'chat-send-button'.");
    }

    if (chatInputField) {
        chatInputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !chatInputField.disabled) {
                event.preventDefault();
                sendMessage();
            }
        });
    } else {
        console.error("Chat input field not found. Check class 'chat-input-field'.");
    }

    setChatUIEnabled(true);
    scrollToBottom();
});



