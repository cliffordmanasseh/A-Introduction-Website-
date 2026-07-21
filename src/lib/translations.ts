export type Language = "ta" | "en";

export const translations = {
  ta: {
    // Common / Nav
    blindAudition: "மறைமுக ஆடிஷன்",
    song: "பாடல்",
    of: "/",
    headphonesRequired: "ஹெட்ஃபோன் அணியவும் 🎧",
    footerAudit: "மறைமுக ஆடிஷன் • 0 முதல் 10 வரை மதிப்பிடவும்",
    footerInvite: "ஆராதனை பாடல் ஆடிஷன் • அழைப்பு மூலம் மட்டுமே",

    // Landing Page
    landingTitle: "வணக்கம்! நமது குடும்பப் பாடலை இணைந்து உருவாக்குவோம்! 🎵",
    landingSub: "இந்தப் பாடலுக்கு எந்த வகையான இசை ட்யூன் சரியாக இருக்கும் என்பதைத் தீர்மானிக்க உங்கள் உதவி தேவை. கீழே உள்ள வாக்கெடுப்பில் உங்கள் விருப்பமான இசை அமைப்பைத் தேர்ந்தெடுங்கள்!",
    howToTitle: "பங்கேற்பது எப்படி?",
    step1: "ஹெட்ஃபோன் அணியவும்: சிறந்த இசை அனுபவத்தைப் பெற ஹெட்ஃபோன் பயன்படுத்தவும்.",
    step2: "இசையைக் கேட்கவும்: பிளே பொத்தானைத் தட்டி இசையைக் கேட்கவும்.",
    step3: "மதிப்பிடவும்: இந்தப் பாடலை நீங்கள் பாட விரும்பும் அளவை 0 முதல் 10 வரை தேர்வு செய்யவும்.",
    step4: "அடுத்த பாடல்: மதிப்பிட்ட பின் 'அடுத்தது' பொத்தானைக் கிளிக் செய்யவும்.",
    invitePrompt: "அழைப்பு குறியீடு / இணைப்பு",
    invitePlaceholder: "அழைப்பு குறியீட்டை உள்ளிடவும் (எ.கா: AUDITION-XXXX)",
    verifyBtn: "சரிபார்",
    verifying: "சரிபார்க்கப்படுகிறது...",
    invalidToken: "தவறான அழைப்பு குறியீடு. இணைப்பைச் சரிபார்க்கவும்.",
    usedToken: "இந்த அழைப்பு இணைப்பு ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது.",
    validToken: "செல்லுபடியாகும் அழைப்பு குறியீடு!",
    startPollBtn: "வாக்கெடுப்பைத் தொடங்குங்கள்",
    resumePollBtn: "தொடரவும் - பாடல் #",
    resetBtn: "மீட்டமை",
    resetConfirm: "உங்கள் தற்போதைய முன்னேற்றத்தை மீட்டமைத்து புதிய அமர்வைத் தொடங்கவா?",
    viewReceiptBtn: "உங்கள் ரசீதைப் பார்க்கவும்",

    // Poll Page
    pollQuestion: "1 முதல் 10 வரையிலான புள்ளிகளில், இந்தப் பாடலை உங்கள் சொந்தப் பாடலாகப் பாட எவ்வளவு விரும்புகிறீர்கள்?",
    playing: "பாடல் ஒலிக்கிறது...",
    tapToPlay: "பாடலைக் கேட்க தட்டவும்",
    prevBtn: "முந்தைய",
    nextBtn: "அடுத்தது",
    submitBtn: "சமர்ப்பிக்க",
    saveBtn: "சேமிக்க",
    notReadyTitle: "பாடல் இன்னும் தயாராகவில்லை",
    startFromTrack1: "பாடல் #1 இல் இருந்து தொடங்கு",

    // Progress Bar
    completed: "நிறைவடைந்துள்ளது",
    allDone: "அனைத்தும் முடிந்தது! சமர்ப்பிக்க தயார் ✨",
    almostDone: "கிட்டத்தட்ட முடிந்துவிட்டது! இன்னும் {n} மட்டுமே 🔥",
    halfWay: "பாதி வழி தாண்டியாச்சு! இன்னும் {n} மீதம் உள்ளன 👍",
    songsRemaining: "இன்னும் {n} பாடல்கள் மீதம் உள்ளன",

    // Rating Slider
    notAtAll: "சற்றும் இல்லை",
    highlyPrefer: "மிகவும் விருப்பம்",

    // Save Modal
    saveModalTitle: "முன்னேற்றம் சேமிக்கப்பட்டது!",
    saveModalMsg: "உங்கள் பதில்கள் ({count} / {total} பாடல்கள்) பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன.",
    saveModalTipHeader: "💡 எப்படி மீண்டும் தொடர்வது?",
    saveModalTipBody: "இந்தப் பக்கத்தின் இணைப்பை மீண்டும் திறந்தால் போதும், நீங்கள் விட்ட இடத்தில் இருந்து தொடரலாம்.",
    continueRatingBtn: "தொடர்ந்து மதிப்பிடவும்",
    goHomeBtn: "முகப்புப் பக்கத்திற்குச் செல்",

    // Review Page
    reviewTitle: "ஆடிஷன் முடிந்தது!",
    reviewSub: "அனைத்துப் பாடல்களையும் வெற்றிகரமாக மதிப்பிட்டு முடித்துவிட்டீர்கள்.",
    reviewEncouragementHeader: "உங்கள் பங்களிப்புக்கு நன்றி!",
    reviewEncouragementBody: "உங்கள் கருத்துக்கள் எங்கள் பாடலை மேலும் சிறப்பக்கவும், உங்கள் அனுபவத்திற்கு ஏற்ப தனித்துவமாக (personalised) அமைக்கவும் பெரிதும் உதவும்.",
    submitResponsesBtn: "பதில்களைச் சமர்ப்பி",
    submitting: "சமர்ப்பிக்கப்படுகிறது...",
    footerReady: "மறைமுக ஆடிஷன் • பதில் சமர்ப்பிக்கத் தயார்",

    // Thank You Page
    responsesSaved: "பதில்கள் பதிவு செய்யப்பட்டன",
    thankYouTitle: "மிக்க நன்றி!",
    thankYouSub: "உங்கள் நேர்மையான இசை மதிப்பீடுகள் வெற்றிகரமாகப் பதிவு செய்யப்பட்டுள்ளன.",
    receiptTitle: "சரிபார்ப்பு ரசீது",
    ratedSongs: "மதிப்பிட்ட பாடல்கள்",
    thankYouConnectionTitle: "🎵 உங்கள் பங்களிப்பிற்கு மிக்க நன்றி!",
    thankYouConnectionBody: "உங்கள் கருத்துக்கள் இந்த பாடலை மேலும் தனித்துவமாகவும் (personalised), நமது குடும்பத்தோடு நெருக்கமாக இணைக்கவும் பெரிதும் உதவும்!",
    thankYouQuote: "சிறந்த ஆராதனை இசை அமைப்புகளைத் தேர்ந்தெடுக்க எங்களுக்கு உதவியதற்கு மனமார்ந்த நன்றி.",
  },
  en: {
    // Common / Nav
    blindAudition: "Blind Audition",
    song: "Song",
    of: "of",
    headphonesRequired: "Wear Headphones 🎧",
    footerAudit: "Blind Audition • Rate from 0 to 10",
    footerInvite: "Worship Audition • By Invitation Only",

    // Landing Page
    landingTitle: "Welcome! Let's build our family song together! 🎵",
    landingSub: "We need your help to choose the best musical arrangement for this worship song. Vote for your preferred variation below!",
    howToTitle: "How to participate?",
    step1: "Wear Headphones: Use headphones for the best listening experience.",
    step2: "Listen to Audio: Tap the play button to listen to each arrangement.",
    step3: "Rate: Choose a score from 0 to 10 based on how much you'd like to sing it.",
    step4: "Next Song: Click 'Next' after submitting your rating.",
    invitePrompt: "Invite Code / Link",
    invitePlaceholder: "Enter invite code (e.g. AUDITION-XXXX)",
    verifyBtn: "Verify",
    verifying: "Verifying...",
    invalidToken: "Invalid invite code. Please check your link.",
    usedToken: "This invite code has already been used.",
    validToken: "Valid invite code!",
    startPollBtn: "Start Voting Poll",
    resumePollBtn: "Resume - Song #",
    resetBtn: "Reset",
    resetConfirm: "Are you sure you want to reset your progress and start a new session?",
    viewReceiptBtn: "View Your Receipt",

    // Poll Page
    pollQuestion: "On a scale of 1 to 10, how much would you like to sing this version as your own song?",
    playing: "Audio playing...",
    tapToPlay: "Tap to play audio",
    prevBtn: "Previous",
    nextBtn: "Next",
    submitBtn: "Submit",
    saveBtn: "Save",
    notReadyTitle: "Song not ready yet",
    startFromTrack1: "Start from Song #1",

    // Progress Bar
    completed: "Completed",
    allDone: "All done! Ready to submit ✨",
    almostDone: "Almost there! Only {n} remaining 🔥",
    halfWay: "Halfway through! {n} remaining 👍",
    songsRemaining: "{n} songs remaining",

    // Rating Slider
    notAtAll: "Not at all",
    highlyPrefer: "Highly prefer",

    // Save Modal
    saveModalTitle: "Progress Saved!",
    saveModalMsg: "Your responses ({count} / {total} songs) have been securely saved.",
    saveModalTipHeader: "💡 How to return?",
    saveModalTipBody: "Simply reopen this link anytime to resume right where you left off.",
    continueRatingBtn: "Continue Rating",
    goHomeBtn: "Go to Homepage",

    // Review Page
    reviewTitle: "Audition Complete!",
    reviewSub: "You have successfully rated all song arrangements.",
    reviewEncouragementHeader: "Thank you for contributing!",
    reviewEncouragementBody: "Your feedback will help us refine our song and make it truly personalized for our worship community.",
    submitResponsesBtn: "Submit Responses",
    submitting: "Submitting...",
    footerReady: "Blind Audition • Ready to Submit",

    // Thank You Page
    responsesSaved: "Responses Recorded",
    thankYouTitle: "Thank You So Much!",
    thankYouSub: "Your honest music ratings have been successfully recorded.",
    receiptTitle: "Verification Receipt",
    ratedSongs: "Rated Songs",
    thankYouConnectionTitle: "🎵 Thank you for your contribution!",
    thankYouConnectionBody: "Your opinions will help us in making our song more personalized and deeply connected to everyone!",
    thankYouQuote: "Heartfelt thanks for helping us choose the best worship musical arrangements.",
  },
};
