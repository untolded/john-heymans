# John Heymans: Olympic Qualification, Ranking Evolution & Data Science Strategy

---

## 1. Overview & Profile
* **Athlete:** John Heymans
* **Country:** Belgium 🇧🇪
* **Specialty:** 3000m / 5000m
* **Academic Background:** Master’s in Bioengineering & Nanotechnology (KU Leuven)
* **Key Achievement:** 11th place in the 5000m Final at the Paris 2024 Olympic Games

---

## 2. Race Breakdown Leading to Qualification

John Heymans achieved direct Olympic qualification by running faster than the automatic entry standard time. However, building up to that moment required strategic participation in key national and international meets to maintain a high World Athletics ranking score.

### The Direct Qualification Race
* **Event:** BU John Thomas Terrier Classic
* **Date:** January 26, 2024
* **Location:** Boston, Massachusetts, USA (Boston University Track & Tennis Center)
* **Result:** **13:03.46** (Indoor 5000m)
* **Significance:** Set a Belgian national record and surpassed the direct Olympic standard cutoff of 13:05.00.

### Key Building & Ranking Races (2023–2024)
| Date | Race / Meeting | Location | Event | Result / Notes |
|---|---|---|---|---|
| **May 20, 2023** | Meeting International de Montgeron | Montgeron, France | 5000m | 13:14.16 (Outdoor PB) |
| **May 27, 2023** | IFAM Oordegem (Flanders Cup) | Oordegem, Belgium | 1500m | 3:40.07 |
| **Aug 24, 2023** | World Athletics Championships | Budapest, Hungary | 5000m (Heat) | 13:39.67 |
| **Dec 10, 2023** | SPAR European Cross Country | Brussels, Belgium | Senior 10km | 30:34 (8th place) |
| **Feb 10, 2024** | Meeting de Liévin | Liévin, France | 3000m Indoor | 7:41.59 |
| **Mar 2, 2024** | World Athletics Indoor Championships | Glasgow, UK | 3000m Indoor | 7:48.18 (8th place) |

---

## 3. World Ranking Evolution (2-Year Timeline)

World Athletics allowed 42 runners in the Olympic 5000m event. Heymans tracked and predicted his rank trajectory over the two-year qualification window:

```
[Sept 2022] Unranked / Outside Top 200
    │
[March 2023] ~#80–#100 globally (Euro Indoor qualification)
    │
[July 2023] #37 globally (~1,205 ranking points) - Enters top-42 cutoff zone
    │
[Dec 2023]  ~#35–#40 globally (Solidified by Euro Cross Country)
    │
[Jan 26, 2024] DIRECT OLYMPIC QUALIFICATION (13:03.46 in Boston)
    │
[June 2024] Top 30 globally (Ahead of Olympic Games)
```

---

## 4. Date of Official Olympic Qualification

* **Official Date:** **January 26, 2024**
* **Method:** Beating the direct Olympic Standard time ($13:05.00$) with a performance of $13:03.46$ at Boston University.

---

## 5. Results at the Paris 2024 Olympic Games

Competing in the Men's 5000m at the Stade de France in Saint-Denis:

1. **5000m Heats (August 7, 2024):**
   * **Place:** 3rd in Heat 1
   * **Time:** 14:08.33
   * **Status:** Qualified directly for the Final
2. **5000m Final (August 10, 2024):**
   * **Place:** **11th in the world**
   * **Time:** 13:19.25

---

## 6. Personal Record (PR) Progression

### 1500m
* **3:45.31** — June 2021 (Nivelles, Belgium)
* **3:40.07** — May 27, 2023 (Oordegem, Belgium)
* **3:38.19** — May 25, 2024 (Brussels, Belgium)

### 3000m
* **7:51.32 (i)** — February 2021 (Louvain-la-Neuve, Belgium)
* **7:42.55 (i)** — February 11, 2023 (Metz, France)
* **7:41.59 (i)** — February 10, 2024 (Liévin, France)
* **7:37.05 (i)** — February 8, 2025 (Boston, MA, USA)

### 5000m
* **13:36.29** — May 2021 (Oordegem, Belgium)
* **13:22.80** — July 2022 (Heusden-Zolder, Belgium)
* **13:14.16** — May 20, 2023 (Montgeron, France)
* **13:03.46 (i)** — January 26, 2024 (Boston, MA, USA) — *National Record & Olympic Standard*

---

## 7. How AI and Data Science Were Used to Qualify

### The Challenge
In late 2022, after finishing his MSc in Bioengineering, Heymans was unranked and lacked major sponsorship or athletic federation support. Traditional guidance suggested competing in 12–15 high-profile outdoor races annually to chase fast times.

### Step-by-Step AI Methodology

#### 1. Machine Learning Cutoff Prediction
Heymans scrapped historic race results and ranking trajectories from prior championship cycles. He built a machine learning model to estimate score inflation for Paris 2024. The model calculated that achieving **~1,215 World Athletics points** would guarantee a spot inside the top 42 qualification window.

#### 2. Optimization of the World Athletics Point Formula
The official ranking point system calculates score per race via:
$$\text{Total Points} = \text{Performance Points (Time)} + \text{Placing Points (Bonus)}$$

Heymans observed that placement points were highly non-linear:
* A modest time with a **Top-3 finish** in a Gold or Silver-tier indoor race yielded higher placement bonus points than a fast time with a 10th-place finish at a Diamond League meet.

#### 3. ChatGPT Calendar & Constraint Optimization
With his targeted score requirement ($1,215 \text{ pts}$) and the point formula dynamics established, Heymans queried ChatGPT to optimize his race calendar:

```text
Constraint Prompting Objective:
Identify the combination of world meetings that maximizes ranking points 
while minimizing total race count, physical fatigue, travel load, and injury risk.
```

ChatGPT evaluated race variables:
* **Event Prestige Tier:** (Gold, Silver, Bronze, World Indoor)
* **Expected Field Depth:** (Probability of securing a Top 3 placement)
* **Required Target Times**

#### 4. The Strategy Executed
* **Focus on Indoor Meets:** Higher point-to-competition ratio.
* **Target Category Gold/Silver Events:** Prioritize high placement bonuses over raw time chasing.
* **Quality Over Quantity:** Limit racing to 3–4 targeted, high-yield events rather than 12+ tiring meets.

### The Outcome
This optimization strategy enabled Heymans to surge into the top 35 globally while remaining fresh and injury-free. Arriving at peak fitness in Boston in January 2024, he broke the Belgian national record in $13:03.46$, beating the direct Olympic standard outright and ultimately reaching the Paris 2024 Olympic Final.