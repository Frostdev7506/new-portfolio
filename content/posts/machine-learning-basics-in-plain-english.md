---
title: "Machine learning interview questions you should know"
seoTitle: "Machine learning interview questions you should know"
description: "Prepare for machine learning interviews with examples of overfitting, bias and variance, data leakage, precision and recall, embeddings, and cosine similarity."
date: "2026-11-04"
category: "Machine learning"
tags: ["Machine Learning", "Interview Preparation", "Overfitting", "Bias and Variance", "Data Leakage", "Precision and Recall", "Embeddings", "Cosine Similarity"]
cover: "/illustrations/articles/machine-learning-interview-questions.webp"
coverAlt: "An open notebook with an overfitting chart and embedding vectors beside a dartboard illustrating bias and variance."
coverWidth: 1536
coverHeight: 1024
takeaway: "Evaluate machine learning on truly unseen data, match metrics to the real cost of mistakes, and use vector similarity to compare meaning rather than raw size."
---

Machine learning interview questions test how you reason about models, data, and predictions. This guide explains six concepts through everyday analogies, worked examples, diagrams, and short interview answers: overfitting, the bias-variance tradeoff, data leakage, precision and recall, embeddings, and cosine similarity.

## How to read this post

Every technical word gets a short explanation in brackets the first time it appears, like this: **model** *(a computer program that learns patterns from examples)*. Each section follows the same pattern: the problem, an everyday analogy, a worked example with numbers, common mistakes, likely interview questions, and one sentence to remember.

The topics are in a deliberate order. The first three are all about one question: *how do we know a model really works?* The last three are about measuring things: how good predictions are, and how similar two pieces of data are.

---

## Part 0: The Foundation, Testing a Model Fairly

### What a model does

A **model** *(a computer program that learns patterns from examples)* looks at past examples and learns a rule from them. Show it thousands of past house sales with their size and price, and it learns something like "bigger houses usually cost more." Then it uses that rule to guess prices for houses it has never seen.

That last part is the whole point. Nobody needs a model to tell them the prices of houses they already know. A model is only useful if it works on **new** data.

### Pretending the future is here: the train/test split

We can't wait for the future to check our model, so we pretend. We take our data and hide part of it.

![Of 100 examples, 80 are used for training and 20 are held back for the final test.](/illustrations/articles/ml-basics/train-test-split.svg "Keep the test set hidden")

- **Training set** *(the data the model learns from)*: like a textbook.
- **Test set** *(data kept hidden, used to check the model at the end)*: like the final exam.

A **row** *(one example, such as one house or one customer)* goes into one set or the other, never both.

The test score is our best guess of how the model will do in real life, **but only if the test set truly stays hidden**. Hold on to that sentence. The next three parts of this post are all about what happens when this idea breaks.

### A third piece: the validation set

In practice, you'll try several models and pick the best. If you compare them on the test set, you're effectively studying for the exam by looking at it. So we carve out one more piece:

![Train on the training set, compare models on validation data, and use the untouched test set for final evaluation.](/illustrations/articles/ml-basics/three-way-split.svg "Three sets, three different jobs")

| Split | What it's for | School analogy |
|---|---|---|
| Training | The model learns | Textbook |
| **Validation** *(data used to compare and adjust models)* | You choose between models | Practice tests |
| Test | One final, honest score | Final exam |

### When data is scarce: cross-validation

Cutting data into three pieces can leave too little to learn from. **Cross-validation** *(reusing the same data by taking turns at being the practice test)* solves this. In 5-fold cross-validation, you cut the training data into 5 equal parts and train 5 times, each time hiding a different part:

![Each of five folds is used for validation once and training four times. Average the five scores; keep a separate final test set.](/illustrations/articles/ml-basics/cross-validation.svg "Five folds, five validation scores")

Every row gets used for both learning and checking, and an average of five scores is more trustworthy than one. The real test set still stays locked away.

> **For the experts:** A test set "wears out." Every time you look at its score and make a decision, a little information leaks from it into your choices. Teams that report results on the same public benchmark for years are, collectively, slowly tuning to it. This is one reason scores on old benchmarks often drop when researchers build fresh test sets that follow the same recipe.

> **Remember:** A model is only as good as its performance on data it has never seen, so that data must stay truly hidden.

---

## Part 1: Overfitting

### The problem

You train a model and it scores 99% on its training data. Is that good news? Not necessarily. The training data is the textbook the model already studied. The question is how it does on the exam.

**Overfitting** *(when a model memorizes its training data instead of learning the general pattern)* means great scores on training data and poor scores on new data.

### The analogy: two students

Two students prepare using the same 20 practice questions.

| | Student A | Student B |
|---|---|---|
| How they study | Memorizes the 20 exact answers | Learns the ideas behind them |
| Score on practice questions | 100% | 90% |
| Score on the real exam (new questions) | 45% | 88% |
| Machine learning equivalent | **Overfit model** | **Good model** |

Student A looks better on practice, but fails where it counts.

### What's really going on: signal and noise

Real-world data contains two kinds of information:

- **Signal** *(the real, repeatable pattern)*: bigger houses really do cost more.
- **Noise** *(random variation that won't happen again)*: one seller was in a hurry and sold cheaply.

A good model learns the signal and ignores the noise. An overfit model learns both, because it can't tell them apart.

![The good fit follows the overall rise in house prices. The overfit curve follows individual noisy observations and can generalize poorly.](/illustrations/articles/ml-basics/overfitting.svg "Learning the pattern versus fitting the noise")

The wiggly curve twisted itself to pass through every random dot. A new house will land somewhere the curve bent for no real reason, so the guess is badly off.

### How to spot it: watch the gap

| Training score | Validation score | Gap | Diagnosis |
|---|---|---|---|
| 95% | 93% | Small | Healthy |
| 99% | 70% | **Large** | **Overfitting** |
| 60% | 58% | Small, but both low | **Underfitting** |

**Underfitting** *(when a model is too simple to learn even the real pattern)* is the opposite problem. Picture a flat line drawn through data that clearly slopes upward. It does badly everywhere.

### Why overfitting happens

| Cause | Why it encourages memorizing |
|---|---|
| Model too complex | It's flexible enough to fit every point, noise included |
| Too little data | A few examples are easy to memorize |
| Training too long | After learning the signal, the model starts learning the noise |
| Noisy data | More noise means more to memorize by mistake |
| Too many **features** *(input columns, like size or age)* | More chances for a random column to look meaningful by luck |

### How to fix it

**1. More data.** Memorizing 20 questions is easy, but memorizing 20,000 is nearly impossible. With enough examples, the only way to score well is to learn the real pattern.

**2. A simpler model.** Fewer moving parts means less ability to memorize. For example, limit how deep a **decision tree** *(a model that makes predictions through a series of yes/no questions)* can grow.

**3. Early stopping.** Models learn in rounds called **epochs** *(one full pass through the training data)*. At first, both scores rise. Later, the validation score starts falling, which means memorizing has begun.

| Round | Training | Validation |
|---|---|---|
| 1 | 60% | 58% |
| 5 | 80% | 78% |
| 10 | 90% | [84%](#highlight "Peak validation") |
| 15 | 95% | 82% |
| 20 | 99% | 75% |

![Training accuracy rises to 99 percent, but validation accuracy peaks at 84 percent at round 10 and then falls to 75 percent.](/illustrations/articles/ml-basics/early-stopping.svg "Stop at the best validation score")

Early stopping *(halting training when the validation score stops improving)* keeps the version of the model from its best round.

**4. Regularization.** Inside every model are **weights** *(the adjustable numbers the model tunes as it learns)*. An overfit model tends to use extreme weights to twist around every point. **Regularization** *(adding a penalty for complexity, so the model prefers simpler solutions)* changes what the model is trying to minimize:

```
 Without regularization:   cost = prediction error
 With regularization:      cost = prediction error + λ × (size of the weights)
```

The model can no longer chase every noisy point for free. **λ (lambda)** *(a number that sets how strong the penalty is)* is the control knob:

| λ | Effect |
|---|---|
| 0 | No penalty, risk of overfitting |
| Moderate | Balanced, usually the goal |
| Very large | Model forced too simple, risk of underfitting |

The two common types:

| Type | What it penalizes | Effect |
|---|---|---|
| **L2, also called Ridge** | The squared size of weights | Shrinks all weights smoothly, rarely to exactly zero |
| **L1, also called Lasso** | The absolute size of weights | Pushes some weights to **exactly zero**, switching those features off entirely |

Analogy: if you were charged for every word you speak, you'd drop the unnecessary ones. L1 does exactly that to features.

**5. Dropout.** In a **neural network** *(a model made of many small connected units called neurons, loosely inspired by the brain)*, **dropout** *(randomly switching off some neurons during each training round)* stops the network from relying on any single shortcut. All neurons are switched back on when it makes real predictions.

**6. Cross-validation.** This detects overfitting rather than preventing it. A model that memorized one particular split will score unevenly across folds.

### Common mistakes

| Mistake | Why it's wrong |
|---|---|
| Celebrating a high training score | It says nothing about new data |
| Training longer to fix a poor validation score | If validation is already falling, more training makes it worse |
| Adding regularization to an underfit model | It makes an already too-simple model even simpler |

### Interview corner

**Q: Training accuracy is 98%, test accuracy is 65%. What's happening?**
> "The large gap means overfitting: the model memorized noise in the training data. I'd add more data if possible, simplify the model, add regularization or dropout, and use early stopping, tracking validation scores with cross-validation."

**Q: L1 vs L2 regularization?**
> "Both penalize large weights. L2 shrinks them all smoothly. L1 pushes some to exactly zero, removing those features, so it also works as feature selection."

> **For the experts:** Early stopping and L2 regularization are close cousins. For simple models trained with gradient descent, stopping early has been shown to behave much like an L2 penalty, because weights start small and only grow as training continues. Cutting training short simply keeps them small.

> **Remember:** Overfitting means memorizing the training data instead of learning the pattern. The warning sign is a big gap between training and validation scores.

---

## Part 2: The Bias-Variance Tradeoff

### The problem

We've seen overfitting (memorizing too much) and underfitting (learning too little). But *why* does making a model more complex fix one and cause the other? The bias-variance tradeoff explains this by splitting a model's mistakes into two understandable sources.

### The analogy: a dartboard

Picture your model as someone throwing darts. Each dart is the model trained on a slightly different sample of data. The bullseye (◎) is the true answer.

![Four dartboards compare centered versus off-center predictions and tight versus scattered predictions. Low bias and low variance cluster near the target.](/illustrations/articles/ml-basics/bias-variance-dartboards.svg "Bias shifts the aim. Variance spreads the shots.")

- **Bias** *(how far off the model is on average)*: where the darts land overall.
- **Variance** *(how much the model's answers change from one training sample to another)*: how spread out the darts are.

### Bias in plain English

> Bias is the error that comes from a model being **too simple** to capture the real pattern.

Suppose the real pattern curves like a "U", and your model can only draw straight lines:

![A horizontal fitted line misses a U-shaped data pattern, illustrating underfitting. The dashed curve traces the underlying pattern.](/illustrations/articles/ml-basics/underfitting.svg "A straight line cannot learn a curved pattern")

Give it a million examples and a week of training, and it's still wrong, because a straight line *cannot* bend. The mistakes are also consistent: train it on different samples and you get nearly the same wrong line every time. That's dartboard 2.

**High bias = underfitting.**

### Variance in plain English

> Variance is the error that comes from a model being **too sensitive** to the exact data it happened to see.

A very deep decision tree reacts to every single point. Change a handful of training rows, and it builds a completely different tree:

```diagram
{"title": "Small data changes can produce different trees", "layout": "comparison", "steps": [{"label": "Sample 1", "detail": "First split: size. Next: age, then floor."}, {"label": "Sample 2", "detail": "First split: location. Next: size, then garden."}, {"label": "Sample 3", "detail": "First split: age. Next: number of bathrooms."}], "caption": "Very different trees from similar training samples are a sign of high variance."}
```

On average these trees might be centered on the truth, but any single one is unreliable. That's dartboard 3.

**High variance = overfitting.**

### The formula, decoded

A model's expected error on new data breaks into three parts:

```
 Total error  =  Bias²  +  Variance  +  Irreducible noise
```

| Part | Plain meaning | Can you reduce it? |
|---|---|---|
| Bias² | Error from being too simple | Yes, with a more flexible model |
| Variance | Error from being too sensitive | Yes, with more data, a simpler model, or regularization |
| **Irreducible noise** *(randomness no model can predict)* | Built into the problem | No |

Irreducible noise is why no model reaches zero error on real data. If a house's price partly depended on the seller's mood that day, no column in your data can capture that.

### Why it's a "tradeoff"

Think of model complexity as a dial.

| Turn the dial toward... | Bias | Variance |
|---|---|---|
| Simpler | Rises | Falls |
| More complex | Falls | Rises |

![Illustrative curves: squared bias decreases with complexity, variance rises, and total error including constant noise has a minimum between the extremes.](/illustrations/articles/ml-basics/bias-variance-tradeoff.svg "The classical bias-variance tradeoff")

On the left, bias dominates. On the right, variance dominates. The goal is not to eliminate either, but to find the dial setting where the total is lowest.

### Diagnosing which one you have: learning curves

A **learning curve** *(a chart of training and validation scores as you give the model more data)* looks different for each problem:

![High-bias training and validation scores flatten low and close together. With high variance, validation improves as more data is added, but remains below training.](/illustrations/articles/ml-basics/learning-curves.svg "Learning curves help diagnose the problem")

This gives one of the most useful rules in practice: **more data fixes variance, not bias.**

### How to fix each

| Problem | Symptoms | Fixes | Won't help |
|---|---|---|---|
| **High bias** | Low training and validation scores, small gap | More flexible model, better features, train longer, less regularization | More data |
| **High variance** | High training score, much lower validation, big gap | More data, simpler model, more regularization, dropout, early stopping | A more complex model |

### Two famous team-up methods

An **ensemble** *(combining many models into one)* can target one side of the tradeoff:

| Method | How it works | Analogy | Reduces |
|---|---|---|---|
| **Random forest** | Trains many deep trees on random slices of data, then averages them | Average the answers of 100 jumpy experts, and their random errors cancel out | **Variance** |
| **Gradient boosting** | Builds small trees one after another, each correcting the last one's mistakes | A student who reviews only the questions they got wrong, round after round | **Bias** |

### Common mistakes

| Mistake | Correction |
|---|---|
| "Bias comes from undertraining" | It mainly comes from the model being too *simple*. No amount of training lets a straight line bend. (Training length does matter for neural networks, but complexity is the main lever.) |
| "More data always helps" | Only for high variance |
| Trying to push both to zero | Irreducible noise always remains, and you're balancing, not eliminating |

### Interview corner

**Q: Explain the bias-variance tradeoff.**
> "Bias is error from overly simple assumptions, which causes underfitting. Variance is error from sensitivity to the particular training data, which causes overfitting. More complexity lowers bias but raises variance, so you look for the complexity that minimizes total error on unseen data."

**Q: Training score is 55%, test score is 53%. Should you collect more data?**
> "Not first. Both scores are low and close, which signals high bias. More data helps variance, not bias. I'd try a more flexible model or better features."

> **For the experts:** The classic U-shaped curve isn't the full story for very large models. Researchers have observed **"double descent"**: as complexity grows past the point where a model can perfectly memorize the training data, test error can rise and then *fall again*. This helps explain why huge neural networks often generalize well despite having far more weights than training examples. The textbook tradeoff still holds well for classical models like trees and linear regression.

> **Remember:** High bias means too simple and consistently wrong. High variance means too sensitive and inconsistent. Good models balance the two.

---

## Part 3: Data Leakage

### The problem

Remember the key sentence from Part 0: the test score is only trustworthy if the test data stays truly hidden. **Data leakage** *(when a model gets access, during training, to information it won't have when making real predictions)* breaks that rule. The model scores brilliantly in testing and then fails in the real world.

### The analogy

A student gets a copy of the exam paper before studying. They score 100%, but the score says nothing about what they've learned. Worse, everyone *believes* the score.

What makes leakage dangerous is that, unlike overfitting, **your scores don't warn you**. Overfitting shows a gap between training and test. Leakage makes the test score itself a lie.

### The one question that catches most leaks

> *"At the moment I make a real prediction, will I actually know this value?"*

There are five common ways leakage happens.

---

#### Type 1: Target leakage (a column gives away the answer)

The **target** *(the thing you're trying to predict)* sneaks into the inputs.

You want to predict whether a customer will cancel their subscription:

| Customer | Months subscribed | Complaints | Cancellation date | Cancelled? |
|---|---|---|---|---|
| A | 12 | 0 | empty | No |
| B | 3 | 4 | 5 March | Yes |
| C | 24 | 1 | empty | No |
| D | 2 | 5 | 9 March | Yes |

"Cancellation date" only has a value **because** the customer already cancelled. The model learns "date filled in → cancelled" and scores 100%. In real life, you predict *before* someone cancels, so that column is always empty and the model is helpless.

| Column | Known at prediction time? | Verdict |
|---|---|---|
| Months subscribed | Yes | Keep |
| Complaints | Yes | Keep |
| Cancellation date | No, it only exists after the outcome | **Remove** |

Real target leaks are usually subtler than this. A few more:

| Goal | Leaky column | Why it leaks |
|---|---|---|
| Predict loan default | "Number of collection calls" | Collection calls start *after* someone defaults |
| Predict pneumonia | "Was given antibiotics" | Antibiotics are given *because* of the diagnosis |
| Predict a purchase | "Total spent this month" | Includes the purchase you're predicting |

---

#### Type 2: Preprocessing leakage (calculating things too early)

**Preprocessing** *(cleaning and preparing data before training, like filling in blanks or rescaling numbers)* often involves calculating something from the data, such as an average. And calculating an average means *looking at* the data.

Five house prices (in lakhs), where the last one belongs to the test set: `10, 12, 11, 13, 100`

```diagram
{"title": "Fit preprocessing on training data only", "layout": "comparison", "steps": [{"label": "Leakage: all rows", "detail": "(10 + 12 + 11 + 13 + 100) ÷ 5 = 29.2. The hidden test value changes the mean."}, {"label": "Correct: training rows", "detail": "(10 + 12 + 11 + 13) ÷ 4 = 11.5. Apply this training mean to the test data."}], "caption": "The test row must not influence the preprocessing statistics."}
```

When your model is live, tomorrow's data hasn't arrived yet. You can't include it in today's averages. Your experiment must behave the same way.

```python
## WRONG: the scaler looks at ALL rows before splitting
X_scaled = scaler.fit_transform(X)
X_train, X_test = train_test_split(X_scaled)

## RIGHT: split first, then learn only from training data
X_train, X_test = train_test_split(X)
scaler.fit(X_train)                  # fit = LEARN the numbers (training only)
X_train = scaler.transform(X_train)  # transform = APPLY them
X_test  = scaler.transform(X_test)   # apply the SAME numbers, never recalculate
```

The rule: **fit on training data, transform on both.**

Inside cross-validation, this has to happen separately for every round, which is easy to get wrong by hand. A **pipeline** *(a bundle of steps that always runs in the correct order)* does it for you:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

pipe = Pipeline([
    ("scale", StandardScaler()),      # re-fitted on each training fold
    ("model", LogisticRegression()),
])
scores = cross_val_score(pipe, X_train, y_train, cv=5)
```

**A dramatic example of how bad this can get.** Take 10,000 columns of pure random numbers and random yes/no labels. There is nothing to learn, so an honest score should be about 50% (a coin flip). Now, *before* cross-validation, select the 20 columns that best match the labels using all the data. With 10,000 random columns, some will match the labels well purely by luck. Cross-validate on those 20 and you can see scores far above 50% on pure noise. The answers got baked into the column choice. Doing the selection inside each fold, via a pipeline, brings the score back to the honest 50%.

---

#### Type 3: Test set peeking (choosing a model using the test set)

You try three models:

| Model | Test score |
|---|---|
| A | 78% |
| B | 82% |
| C | 85% |

You pick C and announce 85%. But this is like retaking the same exam 50 times and reporting your best attempt. You picked the model that happens to suit *that particular* test set, partly by luck. On genuinely new data, C might score 80%.

There's no code bug here. The leak is in your **process**. The fix is the three-way split from Part 0: compare and tune on validation, and touch the test set only once.

---

#### Type 4: Time leakage (using the future to predict the past)

Time only runs forward. When you predict tomorrow, you know everything up to today and nothing after.

**Wrong: shuffling dated data at random**

![Randomly interleaved training and test days allow future information into a model predicting earlier days.](/illustrations/articles/ml-basics/time-split-leakage.svg "Random splits can leak the future")

**Right: split by time**

![Training uses days one through seven; the held-out test uses days eight through ten.](/illustrations/articles/ml-basics/chronological-split.svg "Train on the past. Test on the future.")

A hidden version of this mistake: a feature like "average sales over the last 7 days" for Day 6 must use only days *before* Day 6. If it accidentally averages Days 3 to 9, the future has crept in.

For cross-validation on dated data, use **time-series splits** *(rounds that always train on earlier data and test on later data)*:

![The training window grows from one period to three periods. Each round tests on the immediately following period and leaves later periods unused.](/illustrations/articles/ml-basics/walk-forward-validation.svg "Move the validation window forward in time")

---

#### Type 5: Group and duplicate leakage (the same person on both sides)

Predicting a disease, with several hospital visits per patient:

| Row | Patient | Blood pressure | Age | Disease? |
|---|---|---|---|---|
| 1 | Ravi | 150 | 55 | Yes |
| 2 | Ravi | 152 | 55 | Yes |
| 3 | Ravi | 149 | 55 | Yes |
| 4 | Meena | 110 | 30 | No |
| 5 | Meena | 112 | 30 | No |

```diagram
{"title": "Keep each person on one side of the split", "layout": "comparison", "steps": [{"label": "Leakage: split by row", "detail": "Train: Ravi, Ravi, Meena. Test: Ravi, Meena. Both people have already been seen."}, {"label": "Correct: split by person", "detail": "Train: Ravi, Ravi, Ravi. Test: Meena, Meena. The test contains a genuinely unseen person."}], "caption": "When evaluating new-person performance, all rows for a person must stay in the same group."}
```

With a row-by-row split, the model sees Row 3 and thinks *"I recognize this, it's Ravi, he has the disease."* It memorized the *person*, not the illness. When a brand-new patient walks in, it fails.

The fix is a **group split** *(keeping all rows that belong to the same person or item on the same side)*, available in scikit-learn as `GroupKFold`. Exact duplicate rows cause the same problem, so remove them before splitting.

---

#### How to detect leakage

| Warning sign | What it may mean |
|---|---|
| A score that seems too good for a hard problem | A column is giving away the answer |
| One feature is far more important than all others | That feature may be a stand-in for the target |
| Excellent in testing, poor once deployed | The test setup didn't match real life |
| A very simple model scores almost perfectly | Suspect leakage before suspecting genius |

#### Leakage at a glance

| Type | The mistake | The fix |
|---|---|---|
| 1. Target | A column only exists after the outcome | "Will I know this at prediction time?" |
| 2. Preprocessing | Statistics calculated before splitting | Split first, fit on training only, use pipelines |
| 3. Test peeking | Choosing a model by its test score | Train, validation, test, and touch test once |
| 4. Time | Random split on dated data | Train on the past, test on the future |
| 5. Group/duplicate | Same person or row on both sides | Group splits, remove duplicates |

### Interview corner

**Q: Your model has 99% accuracy on a hard problem. What do you do?**
> "Be suspicious before celebrating. I'd check for a dominant feature, confirm every feature is available at prediction time, verify that preprocessing happened after the split, and check for time ordering and repeated entities across train and test."

**Q: Is scaling before splitting really a problem?**
> "It's usually a mild leak, since no labels are involved, but it breaks the rule that test data stays unseen. With outliers or small datasets it matters more, and with label-based steps like target encoding or feature selection it can be severe."

> **For the experts:** Leakage has a modern twist in large language models: **benchmark contamination** *(test questions appearing in the model's training data)*. These models learn from huge scrapes of the internet, and benchmark questions often get posted online. A model may then "know" answers rather than reason them out. This is why careful evaluations now check for overlap with training data, write fresh held-out questions, or use problems published after the model's training cutoff.

> **Remember:** Data leakage means the model saw information it won't have in real life. Always ask: "Would I know this at the moment of prediction?"

---

## Part 4: Precision and Recall

### The problem

You build a spam filter. How do you judge it? **Accuracy** *(the percentage of predictions that are correct)* seems obvious, but it can badly fool you.

Imagine 100 emails: 10 spam, 90 normal. A lazy model that **always says "not spam"** is right 90 times out of 100. That's 90% accuracy, while catching zero spam. To see through this, we need to look at the *kinds* of mistakes a model makes.

### The four possible outcomes

For every email, the model makes a call, and reality has its own answer. That gives four combinations, laid out in a **confusion matrix** *(a table comparing what the model predicted with what was actually true)*:

| | Model says SPAM | Model says NOT spam |
|---|---|---|
| **Actually spam** | **TP**, true positive *(correctly caught)* ✅ | **FN**, false negative *(missed)* ❌ |
| **Actually not spam** | **FP**, false positive *(false alarm)* ❌ | **TN**, true negative *(correctly ignored)* ✅ |

"Positive" just means "the thing we're looking for," here spam. It doesn't mean good.

### The two scores

**Precision** *(of everything the model flagged, how much was right)*:

```
 Precision = TP / (TP + FP)
```

It asks: **how trustworthy are the model's alarms?**

**Recall** *(of everything that was really positive, how much the model found)*:

```
 Recall = TP / (TP + FN)
```

It asks: **how complete is the model's catch?**

### The analogy: a fishing net

| | Question |
|---|---|
| **Precision** | Of everything in the net, how much is actually fish, and not old boots and seaweed? |
| **Recall** | Of all the fish in the lake, how many ended up in the net? |

### Worked example: fraud detection

There are 1,000 bank transactions, and 20 of them are really fraud. The model flags 10 as fraud, and 8 of those really are.

| | Model says FRAUD | Model says NOT fraud |
|---|---|---|
| **Actually fraud (20)** | TP = **8** | FN = **12** |
| **Actually normal (980)** | FP = **2** | TN = **978** |

| Score | Calculation | Result | Plain meaning |
|---|---|---|---|
| Precision | 8 / (8 + 2) | **80%** | When it raises an alarm, it's usually right |
| Recall | 8 / (8 + 12) | **40%** | It misses most of the fraud |
| Accuracy | (8 + 978) / 1000 | **98.6%** | Looks amazing, hides the problem |

Accuracy says 98.6%, yet 12 out of 20 frauds slipped through. Precision and recall tell the real story.

### Why they pull against each other

Most models don't just say yes or no. They give a **probability** *(a confidence score between 0 and 1)*, and you choose a **threshold** *(the cutoff above which you say "yes")*.

Seven emails, with the model's spam probability:

| Email | Model's probability | Actually spam? |
|---|---|---|
| E1 | 0.95 | Yes |
| E2 | 0.85 | Yes |
| E3 | 0.70 | No |
| E4 | 0.60 | Yes |
| E5 | 0.40 | Yes |
| E6 | 0.35 | No |
| E7 | 0.10 | No |

Watch what happens as you move the threshold:

| Threshold | Flagged as spam | TP | FP | FN | Precision | Recall |
|---|---|---|---|---|---|---|
| 0.9 (strict) | E1 | 1 | 0 | 3 | **100%** | **25%** |
| 0.5 (middle) | E1 to E4 | 3 | 1 | 1 | 75% | 75% |
| 0.3 (jumpy) | E1 to E6 | 4 | 2 | 0 | **67%** | **100%** |

```diagram
{"title": "The threshold changes which mistakes you make", "layout": "comparison", "steps": [{"label": "Higher threshold", "detail": "Flag only high-scoring cases. Often improves precision, while missing more positives and reducing recall."}, {"label": "Lower threshold", "detail": "Flag more cases. Recall rises or stays the same, while false alarms can increase and precision often falls."}], "caption": "Choose the threshold using validation data and the real cost of false alarms and missed positives."}
```

You choose the threshold based on which mistake hurts more.

### Which one matters more?

| Situation | The costlier mistake | Favor |
|---|---|---|
| Spam filter | A real email lost in spam (FP) | **Precision** |
| Cancer screening | A sick patient sent home (FN) | **Recall** |
| Fraud detection | Fraud going unnoticed (FN) | **Recall** |
| Recommending videos | Showing something irrelevant (FP) | **Precision** |

### Combining them: the F1 score

When you need one number, the **F1 score** *(a single score that balances precision and recall)* combines them:

```
 F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

For the fraud model: 2 × (0.8 × 0.4) / (0.8 + 0.4) = **0.53**

F1 uses a special kind of average that punishes imbalance. A plain average of 80% and 40% would be 60%, but F1 is 53%, because it won't let one strong score hide one weak one. A model with 100% precision and 1% recall gets an F1 of about 2%, which is exactly right for a nearly useless model.

### Common mistakes

| Mistake | Correction |
|---|---|
| Reporting only accuracy on rare-event problems | Use precision, recall, and F1 |
| Mixing up the denominators | Precision divides by *what the model flagged*; recall divides by *what was really there* |
| Treating the threshold as fixed at 0.5 | It's a business decision and should match the cost of each mistake |

### Interview corner

**Q: Explain precision and recall.**
> "Precision is the fraction of predicted positives that are correct, so it measures false alarms. Recall is the fraction of actual positives the model found, so it measures misses. They trade off through the decision threshold."

**Q: For fraud detection, which do you prioritize?**
> "Usually recall, since missed fraud is expensive. I'd lower the threshold to catch more, accepting more false alarms, and send borderline cases for human review to manage the precision cost."

> **For the experts:** Precision depends on how common the positive class is, but recall doesn't. Keep the model fixed and make fraud ten times rarer: recall stays the same, because it only looks at real frauds, but precision falls, because the same false-alarm rate now outnumbers the shrinking number of true frauds. So a precision figure from a test set with a different class balance from production can mislead you. It's also why, for rare events, **precision-recall curves** *(charts of precision against recall across all thresholds)* are often more informative than the popular ROC curve.

> **Remember:** Precision asks "when I say yes, am I right?" Recall asks "of all the real yeses, how many did I find?"

---

## Part 5: Embeddings

### The problem

Computers only understand numbers. So how do you hand a model the word "dog"?

**The naive approach: give each word an ID number.**

| Word | ID |
|---|---|
| dog | 1 |
| puppy | 2 |
| invoice | 3 |

These numbers are arbitrary. The computer "sees" puppy (2) and invoice (3) as neighbors, which is nonsense. A slightly better approach, **one-hot encoding** *(a list of zeros with a single 1 marking which word it is)*, avoids that, but makes every word equally different from every other:

```
 dog     = [1, 0, 0]
 puppy   = [0, 1, 0]
 invoice = [0, 0, 1]

 dog vs puppy:   completely different
 dog vs invoice: completely different   ← no notion of meaning
```

With 50,000 words, every word also becomes a list of 50,000 numbers, almost all zero. That's wasteful, and it still knows nothing about meaning.

### The idea: put words on a map

Picture a city map. Every place has coordinates, and **places close together tend to be similar**, like two restaurants on the same food street.

An **embedding** *(a list of numbers that places a word, sentence, or image on a "map of meaning," so similar things sit close together)* does exactly this.

| Word | x (across) | y (up) |
|---|---|---|
| dog | 0.9 | 0.2 |
| puppy | 0.88 | 0.25 |
| invoice | 0.1 | 0.9 |

![Dog at (0.9, 0.2) and puppy at (0.88, 0.25) are close together. Invoice at (0.1, 0.9) is far away.](/illustrations/articles/ml-basics/embedding-map.svg "A small map of meaning")

Dog and puppy are neighbors, and invoice lives far away. For the first time, the numbers carry meaning.

### Where do the numbers come from?

Nobody types them in by hand. The model **learns** them by reading huge amounts of text, guided by a simple idea: **words that appear in similar surroundings have similar meanings.**

```
 "The ___ barked at the postman."     → dog ✓   puppy ✓   invoice ✗
 "Please pay the attached ___."       → dog ✗   puppy ✗   invoice ✓
```

Early methods like **Word2Vec** *(a 2013 technique that learns word embeddings by predicting neighboring words)* trained a small network to guess which words appear near each other. To get good at that guessing game, the network had to place words with similar neighbors close together. The embeddings were a by-product of the game.

A famous result from this era: directions on the map can capture relationships. Roughly, the arrow from "man" to "woman" points the same way as the arrow from "king" to "queen", so `king − man + woman` lands close to `queen`.

### Real embeddings are much bigger

My example used 2 numbers so we can draw it. Real embeddings use hundreds or thousands of **dimensions** *(numbers per item)*, commonly 384, 768, or 1,536. We can't draw that many directions, but the idea is identical: a point on a map, where nearby means similar.

### Not just words

Modern models produce embeddings for whole sentences, documents, images, products, and even users.

| Use | How embeddings help |
|---|---|
| **Semantic search** *(searching by meaning, not exact words)* | "cheap flights" finds a page about "budget airfare" |
| Recommendations | Products whose embeddings are near ones you liked |
| Duplicate detection | Two support tickets describing the same problem in different words |
| **RAG** *(retrieval-augmented generation: an AI chatbot first looks up relevant documents, then answers using them)* | Find the documents whose embeddings are closest to the question |

### Common mistakes

| Mistake | Correction |
|---|---|
| Thinking each number has a clear meaning ("number 7 = animal-ness") | Individual dimensions usually aren't human-readable. Meaning lives in the overall position. |
| Comparing embeddings from two different models | Each model builds its own map. A point from one is meaningless on the other. |
| Assuming embeddings understand everything | They reflect patterns in their training data, including its gaps and biases |

### Interview corner

**Q: What is an embedding, and why not use one-hot encoding?**
> "An embedding is a dense list of numbers, learned from data, where similar items end up close together. One-hot vectors are huge, mostly zeros, and treat every pair of items as equally different, so they capture no similarity."

**Q: How are word embeddings learned?**
> "From context: words used in similar surroundings get similar vectors. Word2Vec does this by training a network to predict neighboring words, and the learned weights become the embeddings."

> **For the experts:** Embeddings from many modern models are **anisotropic** *(bunched into a narrow region of the map instead of spread out evenly)*. As a result, even unrelated texts can score fairly high on similarity, say 0.6 or 0.7. So don't hard-code a universal "similar enough" cutoff. Judge by *ranking* (which results come out on top) or calibrate the threshold for your specific model and data.

> **Remember:** An embedding is a list of numbers that places something on a map of meaning, so similar things sit close together.

---

## Part 6: Cosine Similarity

### The problem

Embeddings put similar things close together. But to actually *use* them for search or recommendations, we need one number that says exactly how similar two embeddings are. **Cosine similarity** *(a score from −1 to 1 based on the angle between two embeddings)* is the most common choice.

### Think in arrows, not dots

Draw each embedding as an arrow from the center of the map (0, 0) to its point. That's all an "embedding arrow" is: the same embedding, drawn as a line instead of a dot.

![Dog at (0.9, 0.2) and puppy at (0.88, 0.25) are close together. Invoice at (0.1, 0.9) is far away. Arrows run from the origin to each point.](/illustrations/articles/ml-basics/embedding-arrows.svg "Similar embeddings point in similar directions")

Dog and puppy point almost the same way. Invoice points somewhere else.

### The score measures the angle

| Angle between the arrows | Score | Meaning |
|---|---|---|
| 0° (same direction) | **1** | Very similar |
| 90° (right angle) | **0** | Unrelated |
| 180° (opposite directions) | **−1** | Opposite |

For our three words:

| Pair | Angle | Cosine similarity | Meaning |
|---|---|---|---|
| dog vs puppy | about 3° | **0.998** | Very similar |
| dog vs invoice | about 71° | **0.32** | Not similar |

### Why the angle, not the distance?

Imagine two pieces of text about cricket: a short tweet and a long article. The article contains more words, so its numbers come out larger and its arrow is **longer**. But it points in the **same direction**, because the topic is the same.

![The vectors (1, 2) and (2, 4) point in exactly the same direction, giving cosine similarity one, even though their lengths differ.](/illustrations/articles/ml-basics/same-direction.svg "Same direction, different lengths")

- Plain **Euclidean distance** *(the straight-line distance between two points, like measuring with a ruler)* says the tips are far apart. That's wrong, since they're about the same thing.
- Cosine similarity looks only at direction and gives a score of 1. That's right.

**Direction carries meaning. Length often just reflects size.**

### The formula, step by step

```
 cosine similarity = (A · B) / (length of A × length of B)
```

- **Dot product** *(A · B: multiply matching numbers, then add the results)* is the top part. It's large when two arrows point the same way.
- The bottom part divides by both lengths, which **cancels out length**, leaving only direction.

**Worked example:** A = [1, 1] and B = [3, 3]

| Step | Calculation | Result |
|---|---|---|
| Dot product | (1 × 3) + (1 × 3) | 6 |
| Length of A | √(1² + 1²) | 1.414 |
| Length of B | √(3² + 3²) | 4.243 |
| Cosine similarity | 6 / (1.414 × 4.243) | **1** |

B is just A made three times longer. Same direction, so the score is exactly 1.

### How it's used in practice: a search example

A user searches for "cheap flights." The system turns the query and each document into embeddings, scores them with cosine similarity, and returns the highest scorers first. The scores below are illustrative:

| Document | Cosine similarity with the query | Rank |
|---|---|---|
| "Budget airfare deals this month" | 0.89 | 1 |
| "How to find low-cost plane tickets" | 0.85 | 2 |
| "Best hotels in Goa" | 0.41 | 3 |
| "Invoice payment instructions" | 0.12 | 4 |

Notice that the top result shares no words with the query. Matching keywords would miss it entirely, but matching meaning finds it.

You'll also see **cosine distance** *(simply 1 minus cosine similarity, so 0 means identical)* used in some tools, because certain libraries expect "smaller = closer."

### Common mistakes

| Mistake | Correction |
|---|---|
| Treating a score like 0.7 as universally "similar" | Typical score ranges vary by model, so compare rankings or calibrate per model |
| Using plain distance on vectors of very different lengths | Distance gets thrown off by length, and cosine ignores it |
| Forgetting to state the number in interviews | "The score is 1, because B is A scaled up" beats "they're similar" |

### Interview corner

**Q: Why use cosine similarity for embeddings instead of Euclidean distance?**
> "Cosine compares direction rather than size, so two embeddings with the same meaning but different magnitudes still score as similar. Euclidean distance would be distorted by magnitude."

**Q: What's the cosine similarity of [1, 1] and [3, 3]?**
> "1, because [3, 3] is just [1, 1] scaled up, so they point in exactly the same direction."

> **For the experts:** Once every embedding is **normalized** *(rescaled to a length of exactly 1)*, three measures become interchangeable. Cosine similarity equals the plain dot product, and squared Euclidean distance equals 2 − 2 × cosine similarity. So all three produce the **same ranking** of search results. That's why many vector databases normalize embeddings once at storage time and then use the cheaper dot product for every search, getting cosine results without dividing by lengths each time.

> **Remember:** Cosine similarity measures the angle between two embedding arrows and ignores their length: 1 means the same direction, 0 means unrelated, −1 means opposite.

---

## Final Cheat Sheet

| Concept | One-line explanation |
|---|---|
| **Train/test split** | Hide some data so you can check the model on examples it has never seen |
| **Cross-validation** | Take turns using different slices as the practice test, then average the scores |
| **Overfitting** | Memorizing the training data, so the model is great on training and bad on new data |
| **Underfitting** | Too simple to learn the pattern, so it's bad everywhere |
| **Regularization** | A penalty for complexity that keeps the model simple |
| **Early stopping** | Stop training when the validation score stops improving |
| **Bias** | Error from being too simple, consistently wrong |
| **Variance** | Error from being too sensitive, inconsistent |
| **Data leakage** | The model sees information it won't have in real life |
| **Precision** | When the model says yes, how often is it right? |
| **Recall** | Of all the real yeses, how many did the model find? |
| **F1 score** | One number balancing precision and recall |
| **Embedding** | A list of numbers placing things on a map of meaning |
| **Cosine similarity** | The angle between two embeddings, ignoring length |

## Glossary

| Term | Plain meaning |
|---|---|
| Model | A program that learns patterns from examples |
| Feature | An input column, like house size or age |
| Target | The thing you're trying to predict |
| Weights | The adjustable numbers inside a model |
| Epoch | One full pass through the training data |
| Threshold | The cutoff above which the model says "yes" |
| Neural network | A model built from many small connected units |
| Pipeline | A bundle of steps that always runs in the right order |
| Dimension | One of the numbers in an embedding |
| Normalize | Rescale an embedding to a length of exactly 1 |

### One habit for interviews

Always give **a number and a one-line reason**. "The cosine similarity is 1, because B is just A scaled up" is far stronger than "they're similar."

---
