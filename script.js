const calculateButton =
  document.getElementById("calculateButton");

const resetButton =
  document.getElementById("resetButton");

const shareButton =
  document.getElementById("shareButton");

const loadingSection =
  document.getElementById("loadingSection");

const loadingBar =
  document.getElementById("loadingBar");

const loadingText =
  document.getElementById("loadingText");

const resultSection =
  document.getElementById("resultSection");


const loadingMessages = [
  "Analysing questionable financial decisions...",
  "Calculating economic consequences...",
  "Consulting the Department of Bad Ideas...",
  "Comparing this purchase to actual responsibilities...",
  "Estimating long-term psychological damage...",
  "Checking whether you really need this...",
  "Searching for financial self-control..."
];


const comments = {
  responsible: [
    "Annoyingly reasonable. You may proceed.",
    "Your bank account barely noticed.",
    "This purchase has failed to create meaningful financial drama."
  ],

  questionable: [
    "Not catastrophic. Not intelligent either.",
    "Your wallet raised an eyebrow.",
    "You can afford it. Whether you should is another question."
  ],

  suspicious: [
    "This purchase deserves a second thought.",
    "Your disposable income has filed a complaint.",
    "Financially legal. Morally questionable."
  ],

  severe: [
    "You did not buy a product. You created a financial event.",
    "Your wallet will remember this.",
    "This purchase has entered the consequences phase."
  ],

  catastrophic: [
    "What the fuck are you doing?",
    "Your bank account would like independent legal representation.",
    "This is less of a purchase and more of an economic sanctions package.",
    "Congratulations. You have successfully converted money into regret."
  ]
};


function euro(value) {
  return new Intl.NumberFormat(
    "en-DE",
    {
      style: "currency",
      currency: "EUR"
    }
  ).format(value);
}


function randomFrom(array) {
  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];
}


function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}


function calculateScore(
  price,
  monthlyIncome,
  disposableIncome,
  debt
) {

  const incomeRatio =
    monthlyIncome > 0
      ? price / monthlyIncome
      : 1;

  const disposableRatio =
    disposableIncome > 0
      ? price / disposableIncome
      : 2;

  const debtRatio =
    debt > 0
      ? price / debt
      : 0;

  let score =
    incomeRatio * 25 +
    disposableRatio * 45 +
    debtRatio * 15;

  if (price > disposableIncome) {
    score += 15;
  }

  return Math.round(
    clamp(score, 0, 100)
  );
}


function getDamageLevel(score) {

  if (score <= 20) {
    return {
      name: "RESPONSIBLE CITIZEN",
      category: "responsible",
      color: "#23d18b"
    };
  }

  if (score <= 40) {
    return {
      name: "QUESTIONABLE",
      category: "questionable",
      color: "#ffd43b"
    };
  }

  if (score <= 60) {
    return {
      name: "FINANCIALLY SUSPICIOUS",
      category: "suspicious",
      color: "#ff922b"
    };
  }

  if (score <= 80) {
    return {
      name: "SEVERE DAMAGE",
      category: "severe",
      color: "#ff5c42"
    };
  }

  return {
    name: "ECONOMIC DISASTER",
    category: "catastrophic",
    color: "#ff253a"
  };
}


function showLoading(callback) {

  resultSection.classList.add("hidden");

  loadingSection.classList.remove("hidden");

  loadingBar.style.width = "0%";

  const duration =
    Math.floor(
      Math.random() * 3001
    ) + 3000;

  const start =
    Date.now();

  const messageInterval =
    setInterval(() => {

      loadingText.textContent =
        randomFrom(
          loadingMessages
        );

    }, 850);


  const progressInterval =
    setInterval(() => {

      const elapsed =
        Date.now() - start;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      loadingBar.style.width =
        `${progress * 100}%`;

      if (progress >= 1) {

        clearInterval(
          progressInterval
        );

        clearInterval(
          messageInterval
        );

        setTimeout(
          callback,
          250
        );
      }

    }, 50);
}


calculateButton.addEventListener(
  "click",
  () => {

    const price =
      Number(
        document.getElementById("price").value
      );

    const hourlyWage =
      Number(
        document.getElementById("hourlyWage").value
      );

    const monthlyHours =
      Number(
        document.getElementById("monthlyHours").value
      );

    const fixedExpenses =
      Number(
        document.getElementById("fixedExpenses").value
      );

    const currentDebt =
      Number(
        document.getElementById("currentDebt").value
      );

    const donerPrice =
      Number(
        document.getElementById("donerPrice").value
      );


    if (
      price <= 0 ||
      hourlyWage <= 0 ||
      monthlyHours <= 0 ||
      fixedExpenses < 0 ||
      currentDebt < 0 ||
      donerPrice <= 0
    ) {

      alert(
        "Please fill in all fields correctly."
      );

      return;
    }


    const monthlyIncome =
      hourlyWage *
      monthlyHours;

    const disposableIncome =
      monthlyIncome -
      fixedExpenses;

    const workHours =
      price /
      hourlyWage;

    const monthlyPercent =
      (
        price /
        monthlyIncome
      ) * 100;

    const disposablePercent =
      disposableIncome > 0
        ? (
            price /
            disposableIncome
          ) * 100
        : Infinity;

    const dailyDisposable =
      disposableIncome /
      30;

    const incomeDays =
      dailyDisposable > 0
        ? price /
          dailyDisposable
        : Infinity;

    const donerEquivalent =
      price /
      donerPrice;

    const debtAfterAlternative =
      Math.max(
        currentDebt -
        price,
        0
      );


    const score =
      calculateScore(
        price,
        monthlyIncome,
        disposableIncome,
        currentDebt
      );


    const damage =
      getDamageLevel(
        score
      );


    showLoading(
      () => {

        loadingSection
          .classList
          .add("hidden");

        resultSection
          .classList
          .remove("hidden");


        document
          .getElementById(
            "damageLevel"
          )
          .textContent =
          damage.name;


        document
          .getElementById(
            "damageLevel"
          )
          .style.color =
          damage.color;


        document
          .getElementById(
            "scoreValue"
          )
          .textContent =
          score;


        document
          .querySelector(
            ".score-circle"
          )
          .style.borderColor =
          damage.color;


        const scoreBar =
          document.getElementById(
            "scoreBar"
          );

        scoreBar.style.width =
          `${score}%`;

        scoreBar.style.background =
          damage.color;


        document
          .getElementById(
            "workHours"
          )
          .textContent =
          `${workHours.toFixed(1)} h`;


        document
          .getElementById(
            "monthlyIncome"
          )
          .textContent =
          euro(
            monthlyIncome
          );


        document
          .getElementById(
            "disposableIncome"
          )
          .textContent =
          euro(
            disposableIncome
          );


        document
          .getElementById(
            "monthlyPercent"
          )
          .textContent =
          `${monthlyPercent.toFixed(1)}%`;


        document
          .getElementById(
            "disposablePercent"
          )
          .textContent =
          Number.isFinite(
            disposablePercent
          )
            ? `${disposablePercent.toFixed(1)}%`
            : "∞";


        document
          .getElementById(
            "incomeDays"
          )
          .textContent =
          Number.isFinite(
            incomeDays
          )
            ? `${incomeDays.toFixed(1)} days`
            : "∞ days";


        document
          .getElementById(
            "donerEquivalent"
          )
          .textContent =
          `${donerEquivalent.toFixed(1)} Döner`;


        const debtText =
          currentDebt === 0
            ? "No debt"
            : `${euro(currentDebt)} → ${euro(debtAfterAlternative)}`;


        document
          .getElementById(
            "debtOpportunity"
          )
          .textContent =
          debtText;


        document
          .getElementById(
            "damageComment"
          )
          .textContent =
          randomFrom(
            comments[
              damage.category
            ]
          );


        resultSection
          .scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

      }
    );

  }
);


shareButton.addEventListener(
  "click",
  async () => {

    const damageLevel =
      document.getElementById("damageLevel").textContent.trim();

    const score =
      document.getElementById("scoreValue").textContent.trim();

    const comment =
      document.getElementById("damageComment").textContent.trim();

    const shareText =
      `Financial Damage: ${score}/100 — ${damageLevel}\n${comment}\n${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Financial Damage Calculator",
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        const originalText = shareButton.textContent;
        shareButton.textContent = "COPIED TO CLIPBOARD";

        setTimeout(() => {
          shareButton.textContent = originalText;
        }, 1800);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("Could not share the result. Your finances remain private... for now.");
      }
    }
  }
);


resetButton.addEventListener(
  "click",
  () => {

    resultSection
      .classList
      .add("hidden");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);
