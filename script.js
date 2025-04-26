function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

var colors = [
  "#490A3D",
  "#BD1550",
  "#E97F02",
  "#F8CA00",
  "#8A9B0F",
  "#69D2E7",
  "#FA6900",
  "#16a085",
  "#27ae60",
  "#2c3e50",
  "#f39c12",
  "#e74c3c",
  "#9b59b6",
  "#FB6964",
  "#342224",
  "#472E32",
  "#77B1A9",
  "#73A857",
];

var currentQuote = "";
var currentAuthor = "";
var randomcolor = "";

// Updated getQuote function to use API
function getQuote() {
  // Show loading state
  $("#newquote").html("Loading...").prop("disabled", true);

  // Get random color
  randomcolor = Math.floor(Math.random() * colors.length);

  // Fetch quote from API
  fetch("https://api.quotable.io/random")
    .then((res) => res.json())
    .then((data) => {
      currentQuote = data.content;
      currentAuthor = data.author;

      // Update tweet link
      $("#tweet-quote").attr(
        "href",
        "https://twitter.com/intent/tweet?hashtags=quotes&text=" +
          encodeURIComponent('"' + currentQuote + '" - ' + currentAuthor)
      );

      // Animate the quote change
      animateQuoteChange();
    })
    .catch((error) => {
      console.error("Error fetching quote:", error);
      // Fallback to local quotes if API fails
      const localQuotes = [
        [
          "You only live once, but if you do it right, once is enough.",
          "Mae West",
        ],
        [
          "I am so clever that sometimes I don't understand a single word of what I am saying.",
          "Oscar Wilde",
        ],
        [
          "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
          "Albert Einstein",
        ],
      ];
      const randomLocal = Math.floor(Math.random() * localQuotes.length);
      currentQuote = localQuotes[randomLocal][0];
      currentAuthor = localQuotes[randomLocal][1];
      animateQuoteChange();
    })
    .finally(() => {
      $("#newquote").html("New Quote").prop("disabled", false);
    });
}

function animateQuoteChange() {
  $("html body").animate(
    {
      backgroundColor: colors[randomcolor],
      color: colors[randomcolor],
    },
    500
  );
  $(
    "#newquote, .social-icons .fa-twitter, .social-icons .fa-volume-up, .social-icons .fa-copy"
  ).animate({ backgroundColor: colors[randomcolor] }, 500);
  $("blockquote footer").animate({ color: colors[randomcolor] }, 500);
  $("blockquote").animate({ borderLeftColor: colors[randomcolor] }, 500);
  $("#quotetext").animate({ opacity: 0 }, 500, function () {
    $(this).animate({ opacity: 1 }, 500);
    $(this).text(currentQuote);
  });
  $("#quotesource").animate({ opacity: 0 }, 500, function () {
    $(this).animate({ opacity: 1 }, 500);
    $(this).text(currentAuthor);
  });
}

function openURL(url) {
  window.open(
    url,
    "Share",
    "width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0"
  );
}

// Text-to-speech functionality
function speakQuote() {
  const utterance = new SpeechSynthesisUtterance(
    `${currentQuote} by ${currentAuthor}`
  );
  speechSynthesis.speak(utterance);
}

// Copy quote functionality
function copyQuote() {
  navigator.clipboard
    .writeText(`"${currentQuote}" - ${currentAuthor}`)
    .then(() => {
      // Show feedback
      const originalTitle = $("#copy-quote").attr("title");
      $("#copy-quote").attr("title", "Copied!");
      setTimeout(() => $("#copy-quote").attr("title", originalTitle), 2000);
    })
    .catch((err) => console.error("Failed to copy: ", err));
}

// Initialize
getQuote();

$(document).ready(function () {
  console.log("ready!");
  $("#newquote").on("click", getQuote);
  $("#speak-quote").on("click", speakQuote);
  $("#copy-quote").on("click", copyQuote);

  // Twitter button click handler
  $("#tweet-quote").on("click", function (e) {
    if (!inIframe()) {
      e.preventDefault();
      openURL($(this).attr("href"));
    }
  });
});
