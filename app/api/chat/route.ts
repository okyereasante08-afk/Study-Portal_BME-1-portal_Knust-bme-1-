import { NextRequest, NextResponse } from 'next/server';

const TIMETABLE_CONTEXT = `
Monday: CHEM 151 (10:30-12:25, PB212), ENGL 157 (17:00-17:55, ENG AUDIT)
Tuesday: COE 153 Lab (08:00-14:55, LAB), COE 181 (17:00-19:00, VSLA)
Wednesday: MATH 151 A (08:00-09:55, VSLA), COE 181 (13:00-13:55, Room 303)
Thursday: ME 161 (08:00-09:55, A110), MATH 151 B (13:00-14:55, PB020), BME 161 (15:00-16:55, PB008)
Friday: COE 153 Lab (10:30-12:25 and 13:00-14:55, LAB)
`;

const MATH151_MANUAL = `MATH: 151
Algebra Questions and Answers


Contents
I

NUMBER THEORY

2

1 Introduction to Numbers and Mathematical Induction

3

2 Algebra of Complex Numbers I

17

3 Algebra of Complex Numbers II

25

II

Vectors and Geometry

34

4 Vector Operations and Products

35

III

54

MATRICES

1


Part I
NUMBER THEORY

2


Chapter 1
Introduction to Numbers and
Mathematical Induction
Solutions to Exercises from Lecture 1, Page 29
1. Let m, n ∈ N. Prove that:
m+n∈N
Proof: We fix an arbitrary m ∈ N and proceed by induction on n.
Base case (n = 1): Since m ∈ N, by the successor property, m + 1 ∈ N.
Inductive hypothesis: Assume m + k ∈ N for some k ∈ N.
Inductive step (n = k + 1): m + (k + 1) = (m + k) + 1. By the inductive hypothesis,
m + k ∈ N. Adding 1 yields another natural number.
Thus, m + n ∈ N for all n ∈ N, and since m was arbitrary, this holds for all m, n ∈ N.
=⇒ m + n ∈ N ∀m, n ∈ N
2. m × n ∈ N
Proof: Fix an arbitrary m ∈ N and proceed by induction on n.
Base case (n = 1): m × 1 = m ∈ N.
Inductive hypothesis: Assume m × k ∈ N for some k ∈ N.
Inductive step (n = k + 1): m × (k + 1) = m × k + m. By the inductive hypothesis,
m × k ∈ N. From part (a), m × k + m ∈ N.
Thus, m × n ∈ N for all n ∈ N, and since m was arbitrary, this holds for all m, n ∈ N.
=⇒ m × n ∈ N ∀m, n ∈ N
3. Prove that n3 + 4nm + 6 ∈ N if n, m ∈ N.
First, we prove the statement holds for all n ∈ N.
Base case for m = 1: For any n ∈ N:
n3 + 4n1 + 6 = n3 + 4n + 6.
Since n3 , 4n, and 6 are all natural numbers (by closure of multiplication and addition), their
sum is natural.

3


Now assume the statement holds for some m = k and all n ∈ N, i.e., n3 + 4nk + 6 ∈ N for
all n ∈ N.
Inductive step for m = k + 1: For any n ∈ N:
n3 + 4nk+1 + 6 = n3 + 4nk · n + 6.
Since nk ∈ N and n ∈ N, their product nk · n ∈ N. Then 4nk · n ∈ N. The sum of three
natural numbers is natural.
By induction on m, the statement holds for all m ∈ N and all n ∈ N.
=⇒ n3 + 4nm + 6 ∈ N ∀n, m ∈ N
4. Find a condition on n ∈ N such that 2n2 − 7n − 4 ∈ N.
Proof:
First, factor: 2n2 − 7n − 4 = (2n + 1)(n − 4). For n ∈ N, we require 2n2 − 7n − 4 ≥ 1 (since
N = {1, 2, 3, . . . }).
Testing small values:
n = 1 : 2 − 7 − 4 = −9 ∈
/N
n = 2 : 8 − 14 − 4 = −10 ∈
/N
n = 3 : 18 − 21 − 4 = −7 ∈
/N
n = 4 : 32 − 28 − 4 = 0 ∈
/N
n = 5 : 50 − 35 − 4 = 11 ∈ N.
Claim: 2n2 − 7n − 4 ∈ N for all n ≥ 5.
Base case (n = 5): 2(25) − 35 − 4 = 11 ∈ N.
Inductive hypothesis: Assume 2k 2 − 7k − 4 ∈ N for some k ≥ 5.
Inductive step (n = k + 1):
2(k + 1)2 − 7(k + 1) − 4 = 2(k 2 + 2k + 1) − 7k − 7 − 4
= 2k 2 + 4k + 2 − 7k − 11
= (2k 2 − 7k − 4) + (4k − 9).
By the inductive hypothesis, 2k 2 − 7k − 4 ∈ N. Since k ≥ 5, 4k − 9 ≥ 11 ∈ N. The sum of
two natural numbers is natural.
By induction, 2n2 − 7n − 4 ∈ N for all n ≥ 5.
Prove the following by mathematical induction:
5. If n ≥ 3, then 2n > n + 4.
Base case (n = 3): 23 = 8 > 3 + 4 = 7. True.
Inductive hypothesis: Assume 2k > k + 4 for some k ≥ 3.
Inductive step (n = k + 1):
2k+1 = 2 · 2k > 2(k + 4) = 2k + 8.
We need to show 2k + 8 > (k + 1) + 4 = k + 5, which simplifies to k > −3, true for k ≥ 3.
Hence, 2k+1 > (k + 1) + 4.
By induction, 2n > n + 4 for all n ≥ 3.
=⇒ 2n > n + 4 ∀n ≥ 3
4


n+1

6. 1 + x + x2 + . . . + xn = 1−x
,
1−x

n ∈ {0, 1, . . .}, x ∈ R \\ {1}.

= 1. True.
Base case (n = 0): LHS = 1, RHS = 1−x
1−x
Inductive hypothesis: Assume true for n = k:
1 + x + · · · + xk =

1 − xk+1
.
1−x

Inductive step (n = k + 1):
k

1 + x + ··· + x + x

k+1

1 − xk+1
=
+ xk+1
1−x
1 − xk+1 + xk+1 (1 − x)
=
1−x
k+2
1−x
=
.
1−x

Thus, the formula holds for n = k + 1.
By induction, it holds for all n ≥ 0.
=⇒ 1 + x + · · · + xn =
7. 12 + 22 + . . . + n2 = 16 n(n + 1)(2n + 1),

1 − xn+1
1−x

n ≥ 1.

Base case (n = 1): LHS = 1, RHS = 61 (1)(2)(3) = 1. True.
Inductive hypothesis: Assume true for n = k:
12 + · · · + k 2 =

k(k + 1)(2k + 1)
.
6

Inductive step (n = k + 1):
k(k + 1)(2k + 1)
+ (k + 1)2
6


k(2k + 1)
= (k + 1)
+ (k + 1)
6
2k 2 + k + 6k + 6
= (k + 1)
6
2
2k + 7k + 6
= (k + 1)
6
(k + 2)(2k + 3)
= (k + 1)
6
(k + 1)(k + 2)(2k + 3)
=
.
6

12 + · · · + k 2 + (k + 1)2 =

This matches the formula for n = k + 1.
By induction, the identity holds for all n ≥ 1.
=⇒ 12 + 22 + · · · + n2 =

5

n(n + 1)(2n + 1)
6


8. If n ≥ 1, then (1 + x)n ≥ 1 + nx for x ∈ R+
Base case (n = 1): (1 + x)1 = 1 + x, equality holds.
Inductive hypothesis: Assume (1 + x)k ≥ 1 + kx for some k ≥ 1.
Inductive step (n = k + 1):
(1 + x)k+1 = (1 + x)k (1 + x)
≥ (1 + kx)(1 + x) (by hypothesis and 1 + x > 0)
= 1 + (k + 1)x + kx2
≥ 1 + (k + 1)x (since kx2 ≥ 0).
Thus, (1 + x)k+1 ≥ 1 + (k + 1)x.
By induction, (1 + x)n ≥ 1 + nx for all n ≥ 1 and x ≥ 0.
=⇒ (1 + x)n ≥ 1 + nx ∀n ≥ 1, x ≥ 0
9. Prove by induction that
n
X

1
r(r + 1) = n(n + 1)(n + 2),
3
r=1

n ≥ 1,

n ∈ N.

Proof:
Base case (n = 1):
LHS = 1(1 + 1) = 1 · 2 = 2
1
6
RHS = · 1 · 2 · 3 = = 2
3
3
Base case holds.
Inductive hypothesis: Assume the formula holds for n = k:
k
X

1
r(r + 1) = k(k + 1)(k + 2).
3
r=1

Inductive step (n = k + 1):
k+1
X

r(r + 1) =

r=1

k
X

r(r + 1) + (k + 1)(k + 2)

r=1

1
= k(k + 1)(k + 2) + (k + 1)(k + 2)
3


k
= (k + 1)(k + 2)
+1
3


k+3
= (k + 1)(k + 2)
3
1
= (k + 1)(k + 2)(k + 3).
3
This matches the formula for n = k + 1.
By the principle of mathematical induction, the formula holds for all n ≥ 1.
=⇒

n
X

1
r(r + 1) = n(n + 1)(n + 2) ∀n ≥ 1
3
r=1
6


10. Prove by induction that
n
X

1
n
=
,
r(r
+
1)
n
+
1
r=1

n ≥ 1,

n ∈ N.

Proof:
Base case (n = 1):
1
1
=
1·2
2
1
1
=
RHS =
1+1
2
LHS =

Base case holds.
Inductive hypothesis: Assume the formula holds for n = k:
k
X

1
k
=
.
r(r + 1)
k+1
r=1

Inductive step (n = k + 1):
k
X
1
1
1
=
+
r(r + 1)
r(r + 1) (k + 1)(k + 2)
r=1
r=1

k+1
X

k
1
+
k + 1 (k + 1)(k + 2)
k(k + 2) + 1
=
(k + 1)(k + 2)
k 2 + 2k + 1
=
(k + 1)(k + 2)
(k + 1)2
=
(k + 1)(k + 2)
k+1
=
.
k+2

=

This matches the formula for n = k + 1.
By induction, the formula holds for all n ≥ 1.
=⇒

n
X

n
1
=
r(r + 1)
n+1
r=1

∀n ≥ 1

11. Let f (n) = 5n + 3, n ∈ N. Prove by induction that f (n) is divisible by 4 for all n ∈ N.
Proof:
Base case (n = 1):
f (1) = 51 + 3 = 5 + 3 = 8
8 is divisible by 4 (since 8 = 4 × 2).
Inductive hypothesis: Assume f (k) = 5k + 3 is divisible by 4 for some k ≥ 1. That is,
5k + 3 = 4m for some integer m.

7


Inductive step (n = k + 1):
f (k + 1) = 5k+1 + 3
= 5 · 5k + 3
= 5(5k + 3) − 15 + 3
= 5(5k + 3) − 12
= 5(4m) − 4 × 3 (by inductive hypothesis)
= 4(5m − 3).
Since 5m − 3 is an integer, f (k + 1) is divisible by 4.
By induction, 5n + 3 is divisible by 4 for all n ∈ N.
12. Prove by induction that for all natural numbers n, 42n − 1 is divisible by 15.
Proof:
Note: 42n − 1 = 16n − 1.
Base case (n = 1):
42 − 1 = 16 − 1 = 15
15 is divisible by 15.
Inductive hypothesis: Assume 16k −1 is divisible by 15 for some k ≥ 1. That is, 16k −1 =
15m for some integer m.
Inductive step (n = k + 1):
16k+1 − 1 = 16 · 16k − 1
= 16(16k − 1) + 16 − 1
= 16(15m) + 15 (by inductive hypothesis)
= 15(16m + 1).
Since 16m + 1 is an integer, 16k+1 − 1 is divisible by 15.
By induction, 42n − 1 is divisible by 15 for all n ∈ N.
13. Prove by induction that
n
X

r2 (r − 1) =

r=2

1
n(n − 1)(n + 1)(3n + 2),
12

n ≥ 2,

n ∈ N.

Proof:
Base case (n = 2):
LHS = 22 (2 − 1) = 4 · 1 = 4
RHS =

1
1
·2·1·3·8=
· 48 = 4
12
12

Base case holds.
Inductive hypothesis: Assume the formula holds for n = k (k ≥ 2):
k
X
r=2

r2 (r − 1) =

1
k(k − 1)(k + 1)(3k + 2).
12

8


Inductive step (n = k + 1):
k+1
X

2

r (r − 1) =

r=2

k
X

r2 (r − 1) + (k + 1)2 k

r=2

1
k(k − 1)(k + 1)(3k + 2) + k(k + 1)2
12
k(k + 1)
[(k − 1)(3k + 2) + 12(k + 1)]
=
12

k(k + 1)  2
=
3k − k − 2 + 12k + 12
12

k(k + 1)  2
3k + 11k + 10
=
12
k(k + 1)
=
(k + 2)(3k + 5)
12
1
= (k + 1)k(k + 2)(3k + 5).
12
=

This matches the formula for n = k + 1 since:
1
1
(k + 1)k(k + 2)(3k + 5) = (k + 1)((k + 1) − 1)((k + 1) + 1)(3(k + 1) + 2).
12
12
By induction, the formula holds for all n ≥ 2.
=⇒

n
X

r2 (r − 1) =

r=2

1
n(n − 1)(n + 1)(3n + 2) ∀n ≥ 2
12

14. Prove by mathematical induction that if n is a positive integer then
n
X

3r + 2
n(2n + 3)
=
r(r + 1)(r + 2)
(n + 1)(n + 2)
r=1

Proof:
Base case (n = 1):
LHS =

3+2
5
3(1) + 2
=
=
1(1 + 1)(1 + 2)
1·2·3
6

RHS =

1(2 · 1 + 3)
1(2 + 3)
5
=
=
(1 + 1)(1 + 2)
2·3
6

Base case holds.
Inductive hypothesis: Assume the formula holds for n = k:
k
X

3r + 2
k(2k + 3)
=
r(r + 1)(r + 2)
(k + 1)(k + 2)
r=1

9


Inductive step (n = k + 1):
k+1
X

k
X
3r + 2
3r + 2
3(k + 1) + 2
=
+
r(r + 1)(r + 2)
r(r + 1)(r + 2) (k + 1)(k + 2)(k + 3)
r=1
r=1

3k + 5
k(2k + 3)
+
(k + 1)(k + 2) (k + 1)(k + 2)(k + 3)
k(2k + 3)(k + 3) + (3k + 5)
=
(k + 1)(k + 2)(k + 3)
k(2k 2 + 3k + 6k + 9) + 3k + 5
=
(k + 1)(k + 2)(k + 3)
3
2k + 9k 2 + 9k + 3k + 5
=
(k + 1)(k + 2)(k + 3)
2k 3 + 9k 2 + 12k + 5
=
(k + 1)(k + 2)(k + 3)
=

(by inductive hypothesis)

Now we need to show this equals the RHS for n = k + 1:
RHS for n = k + 1 =

(k + 1)[2(k + 1) + 3]
(k + 1)(2k + 5)
=
[(k + 1) + 1][(k + 1) + 2]
(k + 2)(k + 3)

Multiply numerator and denominator of RHS by (k + 1):
(k + 1)2 (2k + 5)
(k + 1)(2k + 5)
=
(k + 2)(k + 3)
(k + 1)(k + 2)(k + 3)
So we need to verify:
2k 3 + 9k 2 + 12k + 5 = (k + 1)2 (2k + 5)
Expand the RHS:
(k + 1)2 (2k + 5) = (k 2 + 2k + 1)(2k + 5)
= k 2 (2k + 5) + 2k(2k + 5) + 1(2k + 5)
= 2k 3 + 5k 2 + 4k 2 + 10k + 2k + 5
= 2k 3 + 9k 2 + 12k + 5
This matches exactly with our numerator. Therefore:
k+1
X

2k 3 + 9k 2 + 12k + 5
(k + 1)(2k + 5)
3r + 2
=
=
r(r + 1)(r + 2)
(k + 1)(k + 2)(k + 3)
(k + 2)(k + 3)
r=1

Which is the formula for n = k + 1.
By the principle of mathematical induction, the formula holds for all positive integers n.
=⇒

n
X

3r + 2
n(2n + 3)
=
r(r + 1)(r + 2)
(n + 1)(n + 2)
r=1

15. Question 25

10

∀n ∈ N


Prove by induction that
n
X
r × 2r

(r + 2)!
r=1

=1−

2n+1
,
(n + 2)!

n ≥ 1,

n ∈ N.

Proof:
Base case (n = 1):
LHS =
RHS = 1 −

2
2
1
1 × 21
=
= =
(1 + 2)!
3!
6
3

21+1
22
4
2
1
=1−
=1− =1− =
(1 + 2)!
3!
6
3
3

Base case holds.
Inductive hypothesis: Assume the formula holds for n = k:
k
X
r × 2r
r=1

(r + 2)!

=1−

2k+1
(k + 2)!

Inductive step (n = k + 1):
k+1
X
r × 2r
r=1

(r + 2)!

=

k
X
r × 2r
r=1

(r + 2)!

+

(k + 1) × 2k+1
(k + 3)!

2k+1
(k + 1) × 2k+1
+
(by inductive hypothesis)
(k + 2)!
(k + 3)!
2k+1
(k + 1) × 2k+1
=1−
+
(k + 2)! (k + 3)(k + 2)!


2k+1
k+1
=1−
1−
(k + 2)!
k+3


k+1
2
k + 3 − (k + 1)
=1−
(k + 2)!
k+3


k+1
2
2
=1−
(k + 2)! k + 3
2k+2
=1−
(k + 2)!(k + 3)
2k+2
=1−
(k + 3)!
=1−

This matches the formula for n = k + 1 since (k + 3)! = (k + 1 + 2)! and 2k+2 = 2(k+1)+1 .
By the principle of mathematical induction, the formula holds for all n ≥ 1.
n
X
r × 2r

2n+1
=⇒
=1−
(r + 2)!
(n + 2)!
r=1

∀n ≥ 1

16. Prove by induction that
1
12 + 32 + 52 + 72 + · · · + (2n − 1)2 = n(4n2 − 1),
3
11

n ≥ 1,

n ∈ N.


Proof:
Base case (n = 1):
LHS = (2 · 1 − 1)2 = 12 = 1
RHS =

1
1
1
· 1 · (4 · 12 − 1) = · 1 · (4 − 1) = · 3 = 1
3
3
3

Base case holds.
Inductive hypothesis: Assume the formula holds for n = k:
1
12 + 32 + 52 + · · · + (2k − 1)2 = k(4k 2 − 1)
3
Inductive step (n = k + 1):

1
12 + 32 + 52 + · · · + (2k − 1)2 + [2(k + 1) − 1]2 = k(4k 2 − 1) + (2k + 1)2 (by inductive hypothesis)
3
1
= k(4k 2 − 1) + (4k 2 + 4k + 1)
3
4k 3 − k 12k 2 + 12k + 3
+
=
3
3
4k 3 − k + 12k 2 + 12k + 3
=
3
4k 3 + 12k 2 + 11k + 3
=
3
Now we need to show this equals the RHS for n = k + 1:
1
1
RHS for n = k + 1 = (k + 1)[4(k + 1)2 − 1] = (k + 1)[4(k 2 + 2k + 1) − 1]
3
3
1
1
= (k + 1)(4k 2 + 8k + 4 − 1) = (k + 1)(4k 2 + 8k + 3)
3
3
Expand this:
1
1
(k + 1)(4k 2 + 8k + 3) = [4k 3 + 8k 2 + 3k + 4k 2 + 8k + 3]
3
3
1
= [4k 3 + 12k 2 + 11k + 3]
3
This matches exactly with our result from the inductive step. Therefore:
1
1
12 + 32 + 52 + · · · + (2k − 1)2 + (2k + 1)2 = (k + 1)(4k 2 + 8k + 3) = (k + 1)[4(k + 1)2 − 1]
3
3
Which is the formula for n = k + 1.
By the principle of mathematical induction, the formula holds for all n ≥ 1.
1
=⇒ 12 + 32 + 52 + · · · + (2n − 1)2 = n(4n2 − 1) ∀n ≥ 1
3
17. Prove by induction that if n ∈ N, n ≥ 3, then
n n+1 > (n + 1)n ,

12


and hence deduce that if n ∈ N, n ≥ 3, then
√
√1
n
n > n n n+1 .
Part 1: Proof of n n+1 > (n + 1)n for n ≥ 3 by induction.
Base case n = 3:
34 = 81 > 64 = 43 .
Inductive hypothesis: Assume for some k ≥ 3:
k k+1 > (k + 1)k .

(IH)

Inductive step: We must prove:
(k + 1) k+2 > (k + 2) k+1 .
Rewrite using ratio:
k+1

(k + 1) k+2
1
= 1−
· (k + 1).
(k + 2) k+1
k+2
k
From (IH), we have k > 1 + k1 . Also,
k
k+1
>
k+2
k+1
Thus:


k+1
k+2

But:


Using (IH): 1 + k1

Hence:

k

< k, so:


k+1


>

k
k+1

k+1

k+1
k+2

k+1

k
k+1

k+1
.

1

=

>

for k ≥ 1.

k
1 + k1 ·

1 + k1

.

1
1
=
.
1
k+1
k 1+ k

(k + 1) k+2
k+1
>
= 1.
k+1
(k + 2)
k+1

Therefore (k + 1) k+2 > (k + 2) k+1 , completing the induction.
=⇒ n n+1 > (n + 1)n

for all n ≥ 3, n ∈ N.

Part 2: Deduction of the second inequality.
From n n+1 > (n + 1)n , take the n(n + 1)-th root:
n1/n > (n + 1)1/(n+1) .
Thus an = n1/n is decreasing for n ≥ 3.
Now let m = ⌊n1/n ⌋. Since an is decreasing and m ≤ n1/n < m + 1, we have
1/(n1/n +1)
n1/n > m1/m ≥ n1/n
.
Simplifying yields:

√
n

√1

n > n n n+1 .
13


18. Prove by induction that

dn x
nπ 
n/2 x
,
(e cos x) = 2 e cos x +
dxn
4

n ≥ 1,

n ∈ N.

Base case n = 1:
d x
(e cos x) = ex cos x − ex sin x = ex (cos x − sin x).
dx
√

We write cos x − sin x = 2 cos x + π4 . So:

d x
π
(e cos x) = 21/2 ex cos x +
.
dx
4
Inductive hypothesis: Assume for some k ≥ 1:


dk x
kπ
k/2 x
.
(e cos x) = 2 e cos x +
dxk
4

(IH)

Inductive step: Differentiate both sides of (IH):



dk+1 x
kπ
k/2 d
x
(e cos x) = 2
e cos x +
.
dxk+1
dx
4
Using the product rule:
k/2

=2
Factor ex :







kπ
kπ
x
e cos x +
− e sin x +
.
4
4
x




 
kπ
kπ
e cos x +
− sin x +
.
4
4

k/2 x

=2
Now use the identity:

cos θ − sin θ =


√
π
2 cos θ +
.
4

Here θ = x + kπ
:
4








√
√
kπ
kπ
kπ π
(k + 1)π
cos x +
− sin x +
= 2 cos x +
+
= 2 cos x +
.
4
4
4
4
4
Thus:




√
dk+1 x
(k + 1)π
(k + 1)π
k/2
x
(k+1)/2 x
(e cos x) = 2 · 2 · e cos x +
=2
e cos x +
.
dxk+1
4
4
By induction, the formula holds for all n ≥ 1.
=⇒


dn x
nπ 
n/2 x
(e
cos
x)
=
2
e
cos
x
+
,
dxn
4

14

n ≥ 1.


19. Prove by induction that 2n > n2 for n ≥ 5, n ∈ N.
Base case n = 5:
25 = 32 > 25 = 52 .
Inductive hypothesis: Assume for some k ≥ 5:
2k > k 2 .

(IH)

Inductive step: We must show 2k+1 > (k + 1)2 .
From (IH), multiply by 2:
2k+1 > 2k 2 .
It suffices to prove 2k 2 ≥ (k + 1)2 for k ≥ 5.
Check: 2k 2 − (k + 1)2 = 2k 2 − k 2 − 2k − 1 = k 2 − 2k − 1.
For k ≥ 5, k 2 − 2k − 1 = (k − 1)2 − 2 ≥ 42 − 2 = 14 > 0.
Thus 2k 2 > (k + 1)2 for k ≥ 5.
Combining:
2k+1 > 2k 2 > (k + 1)2 .
Hence 2k+1 > (k + 1)2 , completing the induction.
=⇒ 2n > n2

for all n ≥ 5, n ∈ N.

20. De Moivre’s theorem states:
(cos θ + i sin θ)n ≡ cos nθ + i sin nθ,

n ∈ N.

Prove this theorem by induction.
Base case n = 1:
(cos θ + i sin θ)1 = cos θ + i sin θ = cos(1 · θ) + i sin(1 · θ).
Thus the statement holds for n = 1.
Inductive hypothesis: Assume the theorem holds for some k ≥ 1:
(cos θ + i sin θ)k = cos kθ + i sin kθ.
Inductive step: We must show it holds for n = k + 1:
(cos θ + i sin θ)k+1 = cos((k + 1)θ) + i sin((k + 1)θ).
Start with:
(cos θ + i sin θ)k+1 = (cos θ + i sin θ)k · (cos θ + i sin θ).
Using the inductive hypothesis:
= (cos kθ + i sin kθ)(cos θ + i sin θ).
Expand using complex multiplication:
= cos kθ cos θ + i cos kθ sin θ + i sin kθ cos θ + i2 sin kθ sin θ
= (cos kθ cos θ − sin kθ sin θ) + i(cos kθ sin θ + sin kθ cos θ).
15

(IH)


Now apply the trigonometric addition formulas:
cos kθ cos θ − sin kθ sin θ = cos(kθ + θ) = cos((k + 1)θ),
cos kθ sin θ + sin kθ cos θ = sin(kθ + θ) = sin((k + 1)θ).
Therefore:
(cos θ + i sin θ)k+1 = cos((k + 1)θ) + i sin((k + 1)θ).
Thus, if the theorem holds for n = k, it also holds for n = k + 1.
By the principle of mathematical induction, De Moivre’s theorem holds for all n ∈ N.
=⇒ (cos θ + i sin θ)n ≡ cos nθ + i sin nθ,

16

n ∈ N.


Chapter 2
Algebra of Complex Numbers I
1. Plot the following on an Argand diagram:
a + bi,

i10 ,

i225 .

Solution: First, simplify the powers of i:
i10 = i8 · i2 = (i4 )2 · (−1) = 12 · (−1) = −1.
i225 = i224 · i = (i4 )56 · i = 156 · i = i.
Thus:
• a + bi is at (a, b)
• i10 = −1 is at (0, −1)
• i225 = i is at (0, 1)
Im(z)

i225 = i
i
i10 = −1
−1

a + bi

0

1

Re(z)

−i
Figure 2.1: Argand diagram showing a + bi, i10 = −1, and i225 = i. The thick lines from the origin
show the modulus of each complex number.
Write in standard form, then find imaginary part, modulus, argument, and conjugate:
1
1
2. z1 = 2+i
+ 2−i

Solution:

1
2−i
=
,
2+i
5

17

1
2+i
=
.
2−i
5


Sum:
z1 =

2−i+2+i
4
= .
5
5

Thus:
Im(z1 ) = 0,
4
|z1 | = ,
5
arg(z1 ) = 0 (since z1 is real and positive),
4
z1 = .
5
(3−i)(1+2i)
3. z2 = (1−3i)(2+i)

Solution:
Numerator:
(3 − i)(1 + 2i) = 3 + 6i − i − 2i2 = 3 + 5i + 2 = 5 + 5i.
Denominator:
(1 − 3i)(2 + i) = 2 + i − 6i − 3i2 = 2 − 5i + 3 = 5 − 5i.
So:

5 + 5i
1+i
=
.
5 − 5i
1−i
Multiply numerator and denominator by 1 + i:
z2 =

z2 =

1 + 2i + i2
1 + 2i − 1
(1 + i)2
=
=
= i.
2
1−i
1+1
2

Thus:
Im(z2 ) = 1,
|z2 | = 1,
π
arg(z2 ) = ,
2
z2 = −i.

3−i 2
1−2i

4. z3 =

3−i
Solution: First, simplify 1−2i
:

3 − i 1 + 2i
(3 − i)(1 + 2i)
3 + 6i − i − 2i2
3 + 5i + 2
5 + 5i
·
=
=
=
=
= 1 + i.
1 − 2i 1 + 2i
1+4
5
5
5
Then square:
z3 = (1 + i)2 = 1 + 2i + i2 = 2i.
Thus:
Im(z3 ) = 2,
|z3 | = 2,
π
arg(z3 ) = ,
2
z3 = −2i.
18


5. Show that:

√
√
3+i
3−i
√
+√
− 1 = 0.
3−i
3+i
√

Solution: Let z = √3+i
. Then the second term is z1 . Compute z:
3−i
√
√
√
√
( 3 + i)2
2 + 2 3i
1 + 3i
3 + 2 3i + i2
√
z= √
=
=
.
=
3+1
4
2
( 3 − i)( 3 + i)
Then:

√
√
1
2
1 − 3i
2(1 − 3i)
√ =
=
=
.
z
1+3
2
1 + 3i

Now:

√
√
1
1 + 3i 1 − 3i
z+ =
+
= 1.
z
2
2

Thus:
z+

1
− 1 = 0.
z

3+2i
6. Show that if z1 = −5+7i
and z2 = 3−2i
, then z1 − z2 is real and z1 + z2 is imaginary.
5+7i

Solution: First, compute z1 :
z1 =

Now z2 :

3 + 2i −5 − 7i
(3 + 2i)(−5 − 7i)
−15 − 21i − 10i − 14i2
·
=
=
.
−5 + 7i −5 − 7i
25 + 49
74
−15 − 31i + 14
−1 − 31i
1
31
=
=
= − − i.
74
74
74 74

3 − 2i 5 − 7i
(3 − 2i)(5 − 7i)
15 − 21i − 10i + 14i2
·
=
=
.
5 + 7i 5 − 7i
25 + 49
74
1 − 31i
1
31
15 − 31i − 14
=
=
− i.
=
74
74
74 74

 

1
31
1
31
2
1
z1 − z2 = − − i −
− i =− =−
(real).
74 74
74 74
74
37

 

1
31
1
31
62
31
z1 + z2 = − − i +
− i = − i = − i (imaginary).
74 74
74 74
74
37
z2 =

Then:

7.

Let A, B, C be the representations on the complex plane of zA = 3 + i, zB =
−→ −→
−→
−→
−2 − i, zC = −1 + 4i. Find the coordinates of the vectors: AB, AC and 2AB − 3AC.
−→
−→
What is the argument of 2AB − 3AC?
Solution: Given: zA = 3 + i, zB = −2 − i, zC = −1 + 4i.
−→
AB = zB − zA = (−2 − i) − (3 + i) = (−2 − 3) + (−i − i) = −5 − 2i.
−→
AC = zC − zA = (−1 + 4i) − (3 + i) = (−1 − 3) + (4i − i) = −4 + 3i.
Now:
−→ −→
2AB −3AC = 2(−5−2i)−3(−4+3i) = (−10−4i)−(−12+9i) = −10−4i+12−9i = 2−13i.
p
√
√
Modulus: |2 − 13i| = 22 + (−13)2 = 4 + 169 = 173.
Argument: Since x = 2 > 0, y = −13 < 0, the point is in the 4th quadrant.


 
−13
13
−1
−1
θ = tan
= − tan
≈ −81.25o .
2
2
19


8. Compute real and imaginary part of
z=

i−4
.
2i − 3

9. Compute the absolute value and the conjugate of
z = (1 + i)6 ,

w = i17 .

10. Write in the algebraic form (a + ib) the following complex numbers:
z = i5 + i + 1,

w = (3 + 3i)8 .

11. Write in the trigonometric form (ρ(cos θ + i sin θ)):
a) 8
12. Simplify:

b) 6i

c)



cos

π
π 7
− i sin
.
3
3

3−i
1+i
− (1 + 2i)(2 + 2i) +
;
1−i
1+i
√
2i(i − 1) + ( 3 + i)3 + (1 + i)(1 + i).

13. Compute the square roots of z = −1 − i.
14. Compute the cube roots of z = −8.
15. Prove that there is no complex number such that |z| − z = i.
16. Find z ∈ C such that:
a) z = i(z − 1)

b) z 2 · z = z

c) |z + 3i| = 3|z|.

17. Find z ∈ C such that:
Re(z(1 + i)) + zz = 0;
Re(z 2 ) + iIm(z(1 + 2i)) = −3;
Im((2 − i)z) = 1.
18. Find a ∈ R such that z = −i is a root of the polynomial
P (z) = z 3 − z 2 + z + 1 + a.
Furthermore, for such value of a, find the factors of P (z) in R and in C.

20


Solutions
8.

i − 4 −2i − 3
2 − 3i + 8i + 12
14 + 5i
14
5
·
=
=
=
+i .
2i − 3 −2i − 3
4+9
13
13
13
5
14
Thus Re(z) = 13 , Im(z) = 13 .
z=

9. For z = (1 + i)6 :


h√ 
π i6
3π
π
3π
(1 + i) =
+ i sin
= −8i.
2 cos + i sin
= 8 cos
4
4
2
2
6

Hence |z| = 8, z = 8i.
For w = i17 :
i17 = i · (i4 )4 = i · 14 = i.
Hence |w| = 1, w = −i.
10.
i5 = i,
For w:

z = i + i + 1 = 1 + 2i.

√ 
π
π
,
3 + 3i = 3 2 cos + i sin
4
4
(3 + 3i)8 = 38 · 24 (cos 2π + i sin 2π) = 16 · 38 .

11.
a) 8 = 8(cos 0 + i sin 0)
b) 6i = 6 cos π2 + i sin π2



c) Using de Moivre:

π
π 7
7π
7π
π
π
cos − i sin
= cos
− i sin
= cos − i sin .
3
3
3
3
3
3
12. First expression:
1+i
= i,
1−i

(1 + 2i)(2 + 2i) = 2 + 2i + 4i − 4 = −2 + 6i,

3−i
= 1 − 2i.
1+i

Sum: i − (−2 + 6i) + (1 − 2i) = 3 − 7i.
Second expression:
2i(i − 1) = −2 − 2i,

p
(3 + i)3 = −8i,

(1 + i)(1 + i) = 2.

Sum: (−2 − 2i) + (−8i) + 2 = −10i.
√

5π
13. Write z = 2 cos 5π
+
i
sin
. Square roots:
4
4




√
√
5π
5π
13π
13π
4
4
z1 = 2 cos
+ i sin
, z2 = 2 cos
+ i sin
.
8
8
8
8
14. z = 8(cos π + i sin π). Cube roots:

√
π
π
z1 = 2 cos + i sin
= 1 + i 3,
3
3
z2 = 2(cos π + i sin π) = −2,
21




√
5π
5π
z3 = 2 cos
+ i sin
= 1 − i 3.
3
3
15. Let z = a + ib. Equation becomes:
√
√
a2 + b2 − (a + ib) = i ⇒
a2 + b2 − a = 0, −b = 1.
√
Then b = −1, and a2 + 1 = a, which implies a2 + 1 = a2 ⇒ 1 = 0, impossible.
16. Let z = a + ib.
a) z = i(z − 1) ⇒ a − ib = i(a + ib − 1) ⇒ a = −b, −b = a − 1, no solution.
b) z 2 z = z ⇒ z(zz − 1) = 0 ⇒ z = 0 or |z| = 1.
c) Let z = x + iy. Then:
|x + i(y + 3)| = 3|x + iy|
p
p
x2 + (y + 3)2 = 3 x2 + y 2
Square both sides:
x2 + (y + 3)2 = 9(x2 + y 2 )
x2 + y 2 + 6y + 9 = 9x2 + 9y 2
0 = 8x2 + 8y 2 − 6y − 9


3
2
2
8x + 8 y − y = 9
4
Complete the square for y:
3
y − y=
4
2

Substitute:


2
3
9
y−
−
8
64

"

#
2
9
3
−
8x2 + 8 y −
=9
8
64

2
9
3
2
− =9
8x + 8 y −
8
8

2
3
9
81
8x2 + 8 y −
=9+ =
8
8
8

Divide by 8:

2
 2
3
81
9
x + y−
=
=
8
64
8
2

17. Let z = a + ib.
a) √
Re(z(1 + i)) = a − b. Equation: a − b + a2 + b2 = 0, circle centered at (−1/2, 1/2) radius
2/2.
b) Re(z 2 ) = a2 − b2 , Im(z(1 + 2i)) = 2a − b. System:
a2 − b2 = −3,

2a − b = 0 ⇒ z = 1 + 2i, −1 − 2i.

c) (2 − i)z = 2a + b + i(2b − a), so 2b − a = 1, line x − 2y + 1 = 0.

22


18. P (−i) = i + 1 − i + 1 + a = 2 + a = 0 ⇒ a = −2. Then:
P (z) = z 3 − z 2 + z − 1 = (z − 1)(z 2 + 1) = (z − 1)(z − i)(z + i).
19. Find the modulus of

1+i 1−i
−
.
1−i 1+i

Solution
(1 + i)2 − (1 − i)2
1 + 2i + i2 − (1 − 2i + i2 )
1+i 1−i
−
=
=
1−i 1+i
(1 − i)(1 + i)
1+1
=

1 + 2i − 1 − 1 + 2i + 1
4i
=
= 2i
2
2
√
1+i 1−i
−
= |2i| = 22 = 2.
1−i 1+i

20. Find the real numbers x and y if (x − iy)(3 + 5i) is the conjugate of −6 − 24i.
Solution Let z = (x − iy)(3 + 5i). Then:
z = (3x + 5y) + i(5x − 3y),

z = (3x + 5y) − i(5x − 3y)

Given z = −6 − 24i, so:
(3x + 5y) − i(5x − 3y) = −6 − 24i
Equating real and imaginary parts:
3x + 5y = −6,

5x − 3y = 24

Solving:
9x + 15y = −18,

25x − 15y = 120 =⇒ 34x = 102 =⇒ x = 3

3(3) + 5y = −6 =⇒ 5y = −15 =⇒ y = −3
Thus x = 3, y = −3.
1+2i
.
21. Find the modulus and argument of 1−3i

Solution

1 + 2i 1 + 3i
1 + 3i + 2i + 6i2
−5 + 5i
1 1
·
=
=
=− + i
1 − 3i 1 + 3i
1+9
10
2 2
Let z = r(cos θ + i sin θ). Then:
z=

2

r =

cos θ =



1
−
2

2

 2
1
1
1
+
=
=⇒ r = √
2
2
2

−1/2
1
√ = −√ ,
1/ 2
2

sin θ =

Since θ is in the second quadrant:
θ=π−
Modulus: √12 , Argument: 3π
.
4

23

π
3π
=
4
4

1/2
1
√ =√
1/ 2
2


22. Convert the following to polar form:
1+7i
(i) (2−i)
2,

(ii) 1+3i
1−2i

Solution (i) First compute:
(2 − i)2 = 4 − 4i + i2 = 3 − 4i
1 + 7i 3 + 4i
3 + 4i + 21i + 28i2
−25 + 25i
·
=
=
= −1 + i
3 − 4i 3 + 4i
9 + 16
25
Now −1 + i in polar form:
r=
Polar form:

√

√

1+1=

√

2,

θ=π−

π
3π
=
4
4


3π
2 cos 3π
+
i
sin
.
4
4

Solution (ii)
1 + 3i 1 + 2i
1 + 2i + 3i + 6i2
−5 + 5i
·
=
=
= −1 + i
1 − 2i 1 + 2i
1+4
5
√

.
+ i sin 3π
Same as above: 2 cos 3π
4
4
23. Evaluate:
"

 25 #3
1
i18 +
i

Solution
i18 = (i4 )4 · i2 = 1 · (−1) = −1
 25
1
1
1
= 25 = = −i
i
i
i
 25
1
18
i +
= −1 − i
i
(−1 − i)3 = −(1 + i)3 = −[1 + 3i + 3i2 + i3 ] = −[1 + 3i − 3 − i] = −[−2 + 2i] = 2 − 2i
24. Find the multiplicative inverse of 4 − 3i.
Solution
z = 4 − 3i,

z = 4 + 3i,

z −1 =

|z|2 = 42 + (−3)2 = 25

4 + 3i
z
4
3
=
=
+ i
2
|z|
25
25 25

24


Chapter 3
Algebra of Complex Numbers II
1. Express cos 3θ and sin 4θ in terms of cos θ and sin θ.
Solution using De Moivre’s Theorem:
For cos 3θ:
cos 3θ + i sin 3θ = (cos θ + i sin θ)3 .
Expand using binomial theorem:
(cos θ + i sin θ)3 = cos3 θ + 3i cos2 θ sin θ + 3i2 cos θ sin2 θ + i3 sin3 θ.
Simplify using i2 = −1, i3 = −i:
= cos3 θ + 3i cos2 θ sin θ − 3 cos θ sin2 θ − i sin3 θ.
Separate real and imaginary parts:
cos 3θ = cos3 θ − 3 cos θ sin2 θ = cos3 θ − 3 cos θ(1 − cos2 θ) = 4 cos3 θ − 3 cos θ.
sin 3θ = 3 cos2 θ sin θ − sin3 θ = 3(1 − sin2 θ) sin θ − sin3 θ = 3 sin θ − 4 sin3 θ.
For sin 4θ:
cos 4θ + i sin 4θ = (cos θ + i sin θ)4 .
Expand:
(cos θ + i sin θ)4 = cos4 θ + 4i cos3 θ sin θ + 6i2 cos2 θ sin2 θ + 4i3 cos θ sin3 θ + i4 sin4 θ.
Simplify:
= cos4 θ + 4i cos3 θ sin θ − 6 cos2 θ sin2 θ − 4i cos θ sin3 θ + sin4 θ.
Imaginary part gives sin 4θ:
sin 4θ = 4 cos3 θ sin θ − 4 cos θ sin3 θ = 4 cos θ sin θ(cos2 θ − sin2 θ) = 4 cos θ sin θ cos 2θ.
Alternatively, using double angle:
sin 4θ = 2 sin 2θ cos 2θ = 2(2 sin θ cos θ)(cos2 θ − sin2 θ) = 4 sin θ cos θ(cos2 θ − sin2 θ).

=⇒ cos 3θ = 4 cos3 θ − 3 cos θ,

25

sin 4θ = 4 sin θ cos θ(cos2 θ − sin2 θ)


2. Find the argument and the standard form of the fourth roots of a = cos 2π
+i sin 2π
.
3
3
2π

Solution: First, note a = ei 3 .
The fourth roots are given by:
√
4

zk =

 2π
i

1·e

3 +2kπ
4


π

kπ

= e i( 6 + 2 ) ,

k = 0, 1, 2, 3.

Thus:
√
π
π
3 1
z0 = e = cos + i sin =
+ i,
6
6
2
2
√
π
π
2π
2π
1
3
2π
i( 6 + 2 )
i 3
= e = cos
z1 = e
+ i sin
=− +
i,
3
3
2
2
√
π
7π
7π
7π
3 1
z2 = ei( 6 +π) = ei 6 = cos
+ i sin
=−
− i,
6
6
2 √2
π
3π
5π
5π
3
5π
1
z3 = ei( 6 + 2 ) = ei 3 = cos
+ i sin
= −
i.
3
3
2
2
i π6

Arguments: π6 , 2π
, 7π
, 5π
.
3
6
3
Thus
√
√
√
1
1
3 1
3
3 1
3
+ i, z1 = − +
i, z2 = −
− i, z3 = −
i
z0 =
2
2
2
2
2
2
2
2
√

arg(zk ) =

π kπ
+
, k = 0, 1, 2, 3
6
2

Find the square and cubic roots of:
3. z = 1 + i
Solution: Polar form: z =
Square roots:

Cubic roots:

√ iπ/4
2e .

√
π/4+2kπ
π
4
wk = 2ei( 2 ) = 21/4 ei( 8 +kπ) , k = 0, 1.



π
π
9π
9π
1/4
1/4
w0 = 2
cos + i sin
, w1 = 2
+ i sin
cos
.
8
8
8
8
√
6

π/4+2kπ
3

) = 21/6 ei( 12π + 2kπ
3 ),
k = 0, 1, 2.


π
π
+ i sin
,
w0 = 21/6 cos
12
12
√
√ !


3π
3π
2
2
w1 = 21/6 cos
+ i sin
= 21/6 −
+i
,
4
4
2
2


17π
17π
1/6
w2 = 2
cos
+ i sin
.
12
12
wk =

2ei(

26


4. z = i
Solution: Polar form: z = eiπ/2 .
Square roots:
π/2+2kπ
π
wk = ei( 2 ) = ei( 4 +kπ) , k = 0, 1.
√
√
√
√
2
2
2
2
w0 =
+i
, w1 = −
−i
.
2
2
2
2

Cubic roots:

π/2+2kπ
π
2kπ
wk = ei( 3 ) = ei( 6 + 3 ) , k = 0, 1, 2.
√
√
3 1
3 1
w0 =
+ i, w1 = −
+ i, w2 = −i.
2
2
2
2

5. z = √12 + √i2
Solution: Polar form: z = eiπ/4 .
Square roots:
wk = ei(

π/4+2kπ
2

) = ei( π8 +kπ) ,

k = 0, 1.

) = ei( 12π + 2kπ
3 ),

k = 0, 1, 2.

Similar to part (3) but with modulus 1.
Cubic roots:

wk = ei(

π/4+2kπ
3

Similar to part (3) with modulus 1.
Find the fourth roots of:
6. z = −2i
Solution: Polar form: z = 2e−iπ/2 .
Fourth roots:
wk =
7. z =

√

√
4

2ei(

−π/2+2kπ
4

) = 21/4 ei(− π8 + kπ2 ) ,

k = 0, 1, 2, 3.

) = 21/4 ei( 24π + kπ2 ) ,

k = 0, 1, 2, 3.

3+i

Solution: Polar form: z = 2eiπ/6 .
Fourth roots:
wk =

√
4

8. z = −7 + 24i
Solution: Modulus: |z| =
quadrant).
Fourth roots:
wk =

2ei(

√

π/6+2kπ
4

49 + 576 =

√

625 = 25. Argument: θ = π − tan−1

√
√
θ+2kπ
θ
kπ
4
25ei( 4 ) = 5ei( 4 + 2 ) ,

k = 0, 1, 2, 3.

Solve the equations:
9. z 3 − 125 = 0
Solution:
z 3 = 125 = 125ei0 .
Roots:

z0 = 5,

√
3

125ei(

0+2kπ
3

) = 5ei 2kπ
3 ,
k = 0, 1, 2.
√ !
√ !
1
3
1
3
z1 = 5 − + i
, z2 = 5 − − i
.
2
2
2
2

zk =

27

24
7



(2nd


10. z 4 + 16 = 0
Solution:
z 4 = −16 = 16eiπ .
Roots:
z0 =

√

√
2 + i 2,

√
4

π+2kπ
π
kπ
16ei( 4 ) = 2ei( 4 + 2 ) , k = 0, 1, 2, 3.
√
√
√
√
√
√
z1 = − 2 + i 2, z2 = − 2 − i 2, z3 = 2 − i 2.

zk =

11. z 7 − 2iz 4 − iz 3 − 2 = 0
Solution:
z 7 − 2iz 4 − iz 3 − 2
Group the terms:
(z 7 − 2iz 4 ) + (−iz 3 − 2)
Factor each group:
z 4 (z 3 − 2i) − i(z 3 − 2i)
Factor out the common factor:
(z 3 − 2i)(z 4 − i)
Hence,
(z 3 − 2i)(z 4 − i) = 0.
Case 1: z 3 = 2i
Write 2i in polar form:
2i = 2eiπ/2 .
The cube roots are
z = 21/3 e i(

π/2+2kπ
)
3

,

k = 0, 1, 2.

Thus,
z1 = 21/3 eiπ/6 ,
z2 = 21/3 ei5π/6 ,
z3 = 21/3 ei3π/2 .
Case 2: z 4 = i
Write i in polar form:
i = eiπ/2 .
The fourth roots are
z = e i(

π/2+2kπ
)
4

,

k = 0, 1, 2, 3.

Thus,
z4 = eiπ/8 ,
z5 = ei5π/8 ,
z6 = ei9π/8 ,
z7 = ei13π/8 .

28


Find polar coordinates for:
12. M1 = (−3, 3)
Solution:
r=

p

√
√
18 = 3 2.

(−3)2 + 32 =

π
3π
=
(2nd quadrant).
4
4
√ 3π
(3 2, )
4

θ=π−

√
13. M2 = (−4 3, −4)
Solution:

q
r=

√
√
√
(−4 3)2 + (−4)2 = 48 + 16 = 64 = 8.
π
7π
=
6
6

θ=π+

(8,

(3rd quadrant).
7π
)
6

14. M3 = (0, −5)
Solution:
r = 5.
θ=

3π
2

(negative y-axis).
(5,

3π
)
2

Find Cartesian coordinates for:
15. P1 = (2, π/3)
Solution:

√
π
3 √
y = 2 sin = 2 ·
= 3.
3
2
√
(1, 3)

1
π
x = 2 cos = 2 · = 1,
3
2

16. P2 = (3, −π)
Solution:
x = 3 cos(−π) = 3(−1) = −3,

y = 3 sin(−π) = 3(0) = 0.

(−3, 0)
17. P3 = (1, π/2)
Solution:
x = 1 cos

π
π
= 0, y = 1 sin = 1.
2
2
(0, 1)

29


Find polar representations for:
√
18. z1 = 6 + 6i 3
Solution:

q
√
√
√
r = 62 + (6 3)2 = 36 + 108 = 144 = 12.
√ !
√
6 3
π
θ = tan−1
= tan−1 ( 3) = .
6
3

z1 = 12eiπ/3
19. z2 = −4i
Solution:
r = 4.
3π
π
(or − ).
θ=
2
2
z2 = 4e−iπ/2 or 4ei3π/2
20. z3 = cos a − i sin a,

a ∈ [0, 2π)

Solution:
Using cos(−x) = cos x, and sin(−x) = − sin x:
z3 = cos a − i sin a = cos(−a) + i sin(−a) = e−ia .
z3 = e−ia
21. Solve the quadratic equation
z 2 − 7z + 16 = i(z − 11),

z ∈ C.

Solution
z 2 − 7z + 16 − iz + 11i = 0
z 2 − (7 + i)z + (16 + 11i) = 0
Using the quadratic formula,
z=

(7 + i) ±

p

(7 + i)2 − 4(16 + 11i)
2

(7 + i)2 = 48 + 14i,

4(16 + 11i) = 64 + 44i

∆ = −16 − 30i
Let

√

−16 − 30i = a + bi

(a + bi)2 = a2 − b2 + 2abi = −16 − 30i
Equating real and imaginary parts,
(
a2 − b2 = −16,
2ab = −30
30


Solving gives a = 3, b = −5, hence
√

−16 − 30i = 3 − 5i

(7 + i) ± (3 − 5i)
2
=⇒ z = 5 − 2i or z = 2 + 3i
z=

22. Solve the equation
z − 12 = i(9 − 2z)
Solution
Let
z = x − iy

z = x + iy,

x + iy − 12 = i(9 − 2x + 2iy)
x + iy − 12 = i(9 − 2x) − 2y
Equating real and imaginary parts,
(
x − 12 = −2y,
y = 9 − 2x
Solving,
y = 5,

x=2

=⇒ z = 2 + 5i
23. Find the roots of the cubic equation and the values of a and b
z 3 + az 2 + bz − 5 = 0,
where a, b ∈ R. One root is 2 + i.
Solution
Since the coefficients are real, the complex conjugate 2 − i is also a root.
Let the third root be r ∈ R.
Using the product of roots:
(2 + i)(2 − i)r = 5
(4 + 1)r = 5
r = 1.
The other two roots are 2 − i and 1.
Using the sum of roots:
(2 + i) + (2 − i) + 1 = −a
5 = −a

⇒

a = −5.

Using the sum of products of roots taken two at a time:
(2 + i)(2 − i) + (2 + i)(1) + (2 − i)(1) = b
5 + (2 + i) + (2 − i) = b
9 = b.
31


24. Find the value of x and y in the equation:
1
1
−
= 2 − 3i,
x + iy 1 + i
Solution

x, y ∈ R.

1
1−i
=
.
1+i
2

So,

1
1−i
5 7
= 2 − 3i +
= − i.
x + iy
2
2 2

Invert:

1
2
.
7 =
5 − 7i
− 2i
2

x + iy = 5
Multiply by the conjugate:

2(5 + 7i)
5 + 7i
=
.
25 + 49
37

x + iy =
Thus,
x=

5
,
37

y=

7
37

Solve each of the following equations.
25.
z 2 + 2iz + 8 = 0,

z ∈ C.

Solution
Using the quadratic formula,
p
(2i)2 − 4(1)(8)
.
z=
2
√
√
−2i ± −4 − 32
−2i ± −36
z=
=
.
2
2
−2i ± 6i
z=
.
2
−2i ±

Hence,
=⇒ z = 2i or z = −4i
26. w2 + 16 = 30i,

w ∈ C.

Solution
w2 = −16 + 30i
Let
w = a + bi
Then
(a + bi)2 = a2 − b2 + 2abi = −16 + 30i
Equating real and imaginary parts:
(
a2 − b2 = −16,
2ab = 30
From 2ab = 30, ab = 15 Solving simultaneously gives a = 3, b = 5
32


Thus,
w = 3 + 5i
Since both square roots are required,
w = ±(3 + 5i)

33


Part II
Vectors and Geometry

34


Chapter 4
Vector Operations and Products
Let M = (m1 , m2 ) and N = (n1 , n2 ) be two points in the Cartesian coordinate system
−−→
−−→
−−→
−−→
−−→ −−→ −→
−
→
(O, I, J). Express u = M N , v = M O − 2ON , w = M N + 2N M + ON − OI + 3IJ in terms of
−→
−→
OI and OJ.
Solution: First, express position vectors:
−−→
−→
−→
OM = m1 OI + m2 OJ,
−−→
1. For u = M N :

−−→
−→
−→
ON = n1 OI + n2 OJ.

−−→ −−→ −−→
−→
−→
M N = ON − OM = (n1 − m1 )OI + (n2 − m2 )OJ.

−−→
−−→
2. For v = M O − 2ON :

−−→
−−→
−→
−→
M O = −OM = −m1 OI − m2 OJ,
−−→
−→
−→
2ON = 2n1 OI + 2n2 OJ,
−→
−→
v = (−m1 − 2n1 )OI + (−m2 − 2n2 )OJ.

−−→ −−→ −−→ −→ −
→
−−→
−−→
−→
−→
3. For w = M N +2N M + ON − OI +3IJ: Note: N M = −M N = (m1 −n1 )OI +(m2 −n2 )OJ,
−
→ −→ −→
and IJ = OJ − OI.
−−→
−−→ −−→ −→
−→ −→
w = M N + 2N M + ON − OI + 3(OJ − OI)
−→
= [(n1 − m1 ) + 2(m1 − n1 ) + n1 − 1 − 3]OI
−→
+ [(n2 − m2 ) + 2(m2 − n2 ) + n2 + 3]OJ
−→
= (n1 − m1 + 2m1 − 2n1 + n1 − 4)OI
−→
+ (n2 − m2 + 2m2 − 2n2 + n2 + 3)OJ
−→
−→
= (m1 − 4)OI + (m2 + 3)OJ.
Find a unit vector that has the same direction as:
4. u = 8i − j + k
Solution:
∥u∥ =
Unit vector:

p
√
√
82 + (−1)2 + 12 = 64 + 1 + 1 = 66.



u
1
8
1
1
eu =
= √ (8i − j + k) = √ , − √ , √
.
∥u∥
66
66
66 66

35


5. v = [−2, 1, 2]
Solution:
∥v∥ =

p
√
√
(−2)2 + 12 + 22 = 4 + 1 + 4 = 9 = 3.

Unit vector:



v
1
2 1 2
ev =
= [−2, 1, 2] = − , ,
.
∥v∥
3
3 3 3
√
√
6. Show that u = 2e1 − 4e2 + e3 − 2e4 and v = −4e1 + 8e2 − 2e3 + 8e4 are parallel
vectors.
Solution: Two vectors are parallel if one is a scalar multiple of the other. Factor v:
√
v = −4e1 + 8e2 − 2e3 + 8e4 .
√
√
Note that 8 = 2 2, so:
√
v = −4e1 + 8e2 − 2e3 + 2 2e4 .
Factor out −2:
v = −2(2e1 − 4e2 + e3 −

√

2e4 ) = −2u.

Since v = −2u, the vectors are parallel (opposite directions).
v = −2u =⇒ parallel vectors
Find the vector projection of v onto u:
7. u = [−1, 1],

v = [−2, 4]

Solution: First compute the dot product:
u · v = (−1)(−2) + (1)(4) = 2 + 4 = 6.
Magnitude squared of u:
∥u∥2 = (−1)2 + 12 = 1 + 1 = 2.
Vector projection:
proju v =
8. u = [3/5, −4/5],

u·v
6
u = [−1, 1] = 3[−1, 1] = [−3, 3].
2
∥u∥
2

v = [1, 2]

p
p
2 + (−4/5)2 =
Solution:
Note:
u
is
already
a
unit
vector
since
∥u∥
=
(3/5)
9/25 + 16/25 =
√
1 = 1.
 
 
4
3 8
5
3
(1) + −
(2) = − = − = −1.
u·v =
5
5
5 5
5
Vector projection:


 

3 4
3 4
proju v = (u · v)u = (−1) , − = − ,
.
5 5
5 5
9. u = [1/2, −1/4, −1/2],

v = [2, 2, −2]

Solution: Dot product:
 
 
 
1
1
1
1
3
u·v =
(2) + −
(2) + −
(−2) = 1 − + 1 = .
2
4
2
2
2
36


Magnitude squared of u:
 2  2  2
1
1
1
1
1
1
4+1+4
9
2
∥u∥ =
+ −
+ −
= +
+ =
= .
2
4
2
4 16 4
16
16
Vector projection:
3 16
8
u·v
3/2
u = × u = u.
u=
2
∥u∥
9/16
2
9
3

 

8 1 1 1
4 2 4
=
,− ,− = ,− ,− .
3 2 4 2
3 3 3

proju v =

10. If the position vectors of points P and Q are ⃗a − 2⃗b and 2⃗a + ⃗b respectively, find the position
vector of the point R dividing P Q externally in the ratio 1 : 2.
Solution: For external division in ratio m : n = 1 : 2, the position vector of R is:
⃗r =

m⃗q − n⃗p
m−n

Here p⃗ = ⃗a − 2⃗b, ⃗q = 2⃗a + ⃗b, m = 1, n = 2.
⃗r =

1(2⃗a + ⃗b) − 2(⃗a − 2⃗b)
(2⃗a + ⃗b) − (2⃗a − 4⃗b)
2⃗a + ⃗b − 2⃗a + 4⃗b
5⃗b
=
=
=
= −5⃗b.
1−2
−1
−1
−1

11. If the points (−1, −1, 2), (2, m, 5) and (3, 11, 6) are collinear, find the value of m.
Solution: Let A(−1, −1, 2), B(2, m, 5), C(3, 11, 6).
Vectors:
−→
AB = (2 + 1)î + (m + 1)ĵ + (5 − 2)k̂ = 3î + (m + 1)ĵ + 3k̂
−→
AC = (3 + 1)î + (11 + 1)ĵ + (6 − 2)k̂ = 4î + 12ĵ + 4k̂
−→
−→
For collinearity, AB = λAC for some scalar λ.
3î + (m + 1)ĵ + 3k̂ = λ(4î + 12ĵ + 4k̂)
Equate components:
⇒

3 = 4λ

m + 1 = 12λ = 12 ×

3
4

λ=

3
=9
4

⇒

m = 8.

√
12. Find a vector of magnitude 3 2 units which makes angles of π4 with the y-axis and π2 with
the z-axis.
Solution: Let direction cosines be l, m, n. Given:
m = cos
Using l2 + m2 + n2 = 1:

2
1
2
l + √
+ 02 = 1
2

⇒

π
1
=√ ,
4
2

l2 +

n = cos

1
=1
2

⇒

π
= 0.
2

l2 =

1
2

⇒

1
l = ±√ .
2

Vector ⃗r:



√ 
√
1
1
⃗r = 3 2 lî + mĵ + nk̂ = 3 2 ± √ î + √ ĵ + 0k̂ = ±3î + 3ĵ.
2
2
37


13. Given ⃗a = 2î − ĵ + k̂, ⃗b = î + ĵ − 2k̂, ⃗c = î + 3ĵ − k̂, find λ such that ⃗a is perpendicular to
λ⃗b + ⃗c.
Solution:
λ⃗b + ⃗c = λ(î + ĵ − 2k̂) + (î + 3ĵ − k̂) = (λ + 1)î + (λ + 3)ĵ + (−2λ − 1)k̂.
Condition for perpendicularity: ⃗a · (λ⃗b + ⃗c) = 0.
h
i
(2î − ĵ + k̂) · (λ + 1)î + (λ + 3)ĵ + (−2λ − 1)k̂ = 0
2(λ + 1) − 1(λ + 3) + 1(−2λ − 1) = 0
2λ + 2 − λ − 3 − 2λ − 1 = 0
−λ − 2 = 0 ⇒ λ = −2.
√
14. Find all vectors of magnitude 10 3 that are perpendicular to the plane containing î + 2ĵ + k̂
and −î + 3ĵ + 4k̂.
Solution: Let ⃗a = î + 2ĵ + k̂, ⃗b = −î + 3ĵ + 4k̂.
A vector perpendicular to the plane is ⃗a × ⃗b:
î ĵ k̂
⃗
⃗a × b = 1 2 1 = î(8 − 3) − ĵ(4 + 1) + k̂(3 + 2) = 5î − 5ĵ + 5k̂.
−1 3 4
Magnitude:
|⃗a × ⃗b| =

p

52 + (−5)2 + 52 =

√

√
75 = 5 3.

Unit vector perpendicular to plane:
n̂ =

5î − 5ĵ + 5k̂
⃗a × ⃗b
î − ĵ + k̂
√
√
=
=
.
5 3
3
|⃗a × ⃗b|

√
Required vectors of magnitude 10 3:
√ î − ĵ + k̂
√
√
±10 3 · n̂ = ±10 3 ·
= ±10(î − ĵ + k̂).
3
15. Prove that cos(A − B) = cos A cos B + sin A sin B using vectors.
Solution: Consider two unit vectors in the xy-plane making angles A and B with the x-axis:
⃗ = cos Aî + sin Aĵ,
OP

⃗ = cos B î + sin B ĵ.
OQ

Their dot product:
⃗ · OQ
⃗ = cos A cos B + sin A sin B.
OP
Alternatively, using geometric definition:
⃗ · OQ
⃗ = |OP
⃗ ||OQ|
⃗ cos(∠P OQ) = 1 · 1 · cos(A − B) = cos(A − B).
OP
Equating both expressions:
cos(A − B) = cos A cos B + sin A sin B.

38


16. Prove that in a triangle ABC,
opposite vertices A, B, C.

sin A
sin B
sin C
=
=
, where a, b, c are lengths of sides
a
b
c

Solution: Let sides be represented by vectors:
−−→
BC = ⃗a,

−→ ⃗
CA = b,

−→
AB = ⃗c.

In a triangle:
⃗a + ⃗b + ⃗c = ⃗0

⇒

⃗a + ⃗b = −⃗c.

⃗a × (⃗a + ⃗b) = ⃗a × (−⃗c)

⇒

⃗a × ⃗a + ⃗a × ⃗b = −⃗a × ⃗c.

Cross multiply by ⃗a:

Since ⃗a × ⃗a = ⃗0:
⃗a × ⃗b = ⃗c × ⃗a. (1)
Similarly, cross multiply ⃗a + ⃗b = −⃗c by ⃗b:
⃗b × ⃗a + ⃗b × ⃗b = −⃗b × ⃗c

−⃗a × ⃗b = −⃗b × ⃗c.

⇒

⃗a × ⃗b = ⃗b × ⃗c. (2)
From (1) and (2):
⃗a × ⃗b = ⃗b × ⃗c = ⃗c × ⃗a.
Taking magnitudes:
|⃗a × ⃗b| = |⃗b × ⃗c| = |⃗c × ⃗a|.
|⃗a||⃗b| sin(π − C) = |⃗b||⃗c| sin(π − A) = |⃗c||⃗a| sin(π − B).
ab sin C = bc sin A = ca sin B.
Dividing by abc:
sin C
sin A
sin B
=
=
.
c
a
b
17. Given |⃗a| = 8, |⃗b| = 3, |⃗a × ⃗b| = 12, find the angle between ⃗a and ⃗b.
Solution: We know:
|⃗a × ⃗b| = |⃗a||⃗b| sin θ = 8 × 3 sin θ = 24 sin θ.
Given |⃗a × ⃗b| = 12:
24 sin θ = 12

⇒

1
sin θ = .
2

Thus θ = 30◦ or θ = 150◦ .
18. Find the projection of ⃗a = 2î − ĵ + k̂ along ⃗b = î + 2ĵ + 2k̂.
Solution: Projection formula:
Proj⃗b⃗a =

⃗a · ⃗b
.
|⃗b|

⃗a · ⃗b = (2)(1) + (−1)(2) + (1)(2) = 2 − 2 + 2 = 2.
√
√
√
|⃗b| = 12 + 22 + 22 = 1 + 4 + 4 = 9 = 3.
2
Proj⃗b⃗a = .
3
39


19. If ⃗a and ⃗b are unit vectors, find the angle between them such that
vector.
Solution: Let θ be the angle between ⃗a and ⃗b. Given |⃗a| = |⃗b| = 1.

√
3⃗a − ⃗b is also a unit

√
√
√
| 3⃗a − ⃗b|2 = ( 3⃗a − ⃗b) · ( 3⃗a − ⃗b).
√
√
√
= 3|⃗a|2 + |⃗b|2 − 2 3⃗a · ⃗b = 3(1) + 1 − 2 3(⃗a · ⃗b) = 4 − 2 3 cos θ.
√
Given | 3⃗a − ⃗b| = 1, so:
√
4 − 2 3 cos θ = 1

√
2 3 cos θ = 3

⇒

√
3
3
cos θ = √ =
.
2
2 3

⇒
√

◦

θ = 30

◦

(since cos 30 =

3
).
2

20. The vectors from origin to points A and B are ⃗a = 2î−3ĵ +2k̂ and ⃗b = 2î+3ĵ + k̂ respectively.
Find the area of triangle OAB.
Solution: Area of triangle OAB = 21 |⃗a × ⃗b|.
Compute ⃗a × ⃗b:
î ĵ k̂
⃗a × ⃗b = 2 −3 2
2 3 1
= î [(−3)(1) − (2)(3)] − ĵ [(2)(1) − (2)(2)] + k̂ [(2)(3) − (−3)(2)]
= î [−3 − 6] − ĵ [2 − 4] + k̂ [6 + 6]
= −9î + 2ĵ + 12k̂.
Magnitude:
|⃗a × ⃗b| =

p

(−9)2 + 22 + 122 =

Area:
Area =

√

81 + 4 + 144 =

√
229.

1√
229.
2

21. Find the value of λ for which the vectors λî + ĵ + 2k̂, î + λĵ − k̂, and 2î − ĵ + λk̂ are coplanar.
Solution: Three vectors ⃗u, ⃗v , w
⃗ are coplanar if their scalar triple product is zero:
[⃗u ⃗v w]
⃗ = 0.
Here:
⃗u = λî + ĵ + 2k̂,

⃗v = î + λĵ − k̂,

w
⃗ = 2î − ĵ + λk̂.

Scalar triple product:
λ 1
2
⃗u · (⃗v × w)
⃗ = 1 λ −1 = 0.
2 −1 λ
Expand determinant:
=λ

λ −1
1 −1
1 λ
−1
+2
.
−1 λ
2 λ
2 −1

= λ[λ · λ − (−1)(−1)] − 1[1 · λ − (−1)(2)] + 2[1 · (−1) − λ · 2].
= λ(λ2 − 1) − 1(λ + 2) + 2(−1 − 2λ).
= λ3 − λ − λ − 2 − 2 − 4λ.
40


= λ3 − 6λ − 4.
Set to zero:
λ3 − 6λ − 4 = 0.
Test λ = −2:
(−2)3 − 6(−2) − 4 = −8 + 12 − 4 = 0.
Thus λ = −2 is a solution. The cubic factors as:
(λ + 2)(λ2 − 2λ − 2) = 0.
Other roots are λ = 1 ±

√

3

22. For any vector ⃗a, find the value of (⃗a × î)2 + (⃗a × ĵ)2 + (⃗a × k̂)2 .
Solution: Note: Here (⃗a × î)2 means |⃗a × î|2 .
Let ⃗a = a1 î + a2 ĵ + a3 k̂.
Compute ⃗a × î:
î ĵ k̂
⃗a × î = a1 a2 a3 = î(0) − ĵ(−a3 ) + k̂(−a2 ) = a3 ĵ − a2 k̂.
1 0 0
Magnitude squared:
|⃗a × î|2 = a23 + a22 .
Similarly, ⃗a × ĵ:
î ĵ k̂
⃗a × ĵ = a1 a2 a3 = î(−a3 ) − ĵ(0) + k̂(a1 ) = −a3 î + a1 k̂.
0 1 0
|⃗a × ĵ|2 = a23 + a21 .
And ⃗a × k̂:
î ĵ k̂
⃗a × k̂ = a1 a2 a3 = î(a2 ) − ĵ(a1 ) + k̂(0) = a2 î − a1 ĵ.
0 0 1
|⃗a × k̂|2 = a22 + a21 .
Now sum:
S = (a22 + a23 ) + (a23 + a21 ) + (a21 + a22 ) = 2(a21 + a22 + a23 ) = 2|⃗a|2 .
Thus:
(⃗a × î)2 + (⃗a × ĵ)2 + (⃗a × k̂)2 = 2⃗a2 .
23. Find the number of vectors of unit length perpendicular to both ⃗a = 2î+ ĵ +2k̂ and ⃗b = ĵ + k̂.
Solution: A vector perpendicular to both ⃗a and ⃗b is ⃗a × ⃗b.
Compute:
î ĵ k̂
⃗
⃗a × b = 2 1 2
0 1 1
41


= î(1 · 1 − 2 · 1) − ĵ(2 · 1 − 2 · 0) + k̂(2 · 1 − 1 · 0)
= î(1 − 2) − ĵ(2 − 0) + k̂(2 − 0) = −î − 2ĵ + 2k̂.
Magnitude:
|⃗a × ⃗b| =

p
√
√
(−1)2 + (−2)2 + 22 = 1 + 4 + 4 = 9 = 3.

Unit vector perpendicular to both:
n̂ = ±

⃗a × ⃗b
−î − 2ĵ + 2k̂
.
=±
3
|⃗a × ⃗b|

There are exactly two unit vectors (opposite directions) perpendicular to both given vectors.
Thus the number is two.
24. Show that:

i × i = 0,
j × i = −k, k × i = j,
i × j = k,
j × j = 0,
k × j = −i
i × k = −j, j × k = i,
k × k = 0.

Solution: Using the cross product formula with i = [1, 0, 0], j = [0, 1, 0], k = [0, 0, 1]:
i j k
i×i= 1 0 0 =0
1 0 0
i j k
i×j= 1 0 0 =k
0 1 0
i j k
i × k = 1 0 0 = −j
0 0 1
i j k
j × i = 0 1 0 = −k
1 0 0
i j k
j×j= 0 1 0 =0
0 1 0
i j k
j×k= 0 1 0 =i
0 0 1
i j k
k×i= 0 0 1 =j
1 0 0
i j k
k × j = 0 0 1 = −i
0 1 0
i j k
k×k= 0 0 1 =0
0 0 1
Find u × v where:
42


25. u = [1, −1, 1] and v = [2, 1, 0]
Solution:
i j k
u × v = 1 −1 1
2 1 0
=i

1 1
1 −1
−1 1
−j
+k
1 0
2 0
2 1

= i(−1 · 0 − 1 · 1) − j(1 · 0 − 1 · 2) + k(1 · 1 − (−1) · 2)
= i(0 − 1) − j(0 − 2) + k(1 + 2)
= −i + 2j + 3k = [−1, 2, 3]
26. u = i + j cos θ + k sin θ and v = i − j sin θ + k cos θ
Solution: Write vectors as u = [1, cos θ, sin θ], v = [1, − sin θ, cos θ].
i
j
k
u × v = 1 cos θ sin θ
1 − sin θ cos θ

=i

cos θ sin θ
1 sin θ
1 cos θ
−j
+k
− sin θ cos θ
1 cos θ
1 − sin θ

= i(cos θ · cos θ − sin θ · (− sin θ)) − j(1 · cos θ − sin θ · 1) + k(1 · (− sin θ) − cos θ · 1)
= i(cos2 θ + sin2 θ) − j(cos θ − sin θ) + k(− sin θ − cos θ)
= i(1) − j(cos θ − sin θ) − k(sin θ + cos θ)
= [1, − cos θ + sin θ, − sin θ − cos θ]
Let u = [u1 , u2 , u3 ], v = [v1 , v2 , v3 ], w = [w1 , w2 , w3 ]:
27. Express w · [u × v] in terms of coordinates.
Solution: First compute u × v:
u × v = [u2 v3 − u3 v2 , u3 v1 − u1 v3 , u1 v2 − u2 v1 ].
Then dot product with w:
w · [u × v] = w1 (u2 v3 − u3 v2 ) + w2 (u3 v1 − u1 v3 ) + w3 (u1 v2 − u2 v1 )
w1 w2 w3
= u1 u2 u3 .
v1 v2 v3
w1 w2 w3
=⇒ w · [u × v] = u1 u2 u3
v1 v2 v3
28. Show u × v is perpendicular to u and v.
Solution: Check perpendicularity using dot product:
(u × v) · u = [u2 v3 − u3 v2 , u3 v1 − u1 v3 , u1 v2 − u2 v1 ] · [u1 , u2 , u3 ]
= u1 (u2 v3 − u3 v2 ) + u2 (u3 v1 − u1 v3 ) + u3 (u1 v2 − u2 v1 )
= u1 u2 v3 − u1 u3 v2 + u2 u3 v1 − u1 u2 v3 + u1 u3 v2 − u2 u3 v1 = 0.
43


Similarly,
(u × v) · v = [u2 v3 − u3 v2 , u3 v1 − u1 v3 , u1 v2 − u2 v1 ] · [v1 , v2 , v3 ]
= v1 (u2 v3 − u3 v2 ) + v2 (u3 v1 − u1 v3 ) + v3 (u1 v2 − u2 v1 )
= u2 v1 v3 − u3 v1 v2 + u3 v1 v2 − u1 v2 v3 + u1 v2 v3 − u2 v1 v3 = 0.
Since both dot products are zero, u × v is perpendicular to both u and v.
29. Find a unit vector perpendicular to plane through P = (1, 4, 6), Q = (−2, 5, −1),
R = (1, −1, 1) and compute area of triangle P QR.
Solution: First find two vectors in the plane:
−→
P Q = Q − P = (−2 − 1, 5 − 4, −1 − 6) = [−3, 1, −7],
−→
P R = R − P = (1 − 1, −1 − 4, 1 − 6) = [0, −5, −5].
A vector perpendicular to the plane is their cross product:
i
j
k
−→ −→
n = P Q × P R = −3 1 −7 .
0 −5 −5

n=i

1 −7
−3 −7
−3 1
−j
+k
−5 −5
0 −5
0 −5

= i(1 · (−5) − (−7) · (−5)) − j(−3 · (−5) − (−7) · 0) + k(−3 · (−5) − 1 · 0)
= i(−5 − 35) − j(15 − 0) + k(15 − 0)
= −40i − 15j + 15k = [−40, −15, 15].
Unit vector perpendicular to plane:
p
√
√
√
∥n∥ = (−40)2 + (−15)2 + 152 = 1600 + 225 + 225 = 2050 = 5 82.


1
8
3
3
n
= √ [−40, −15, 15] = − √ , − √ , √
en =
.
∥n∥
5 82
82
82 82
Area of triangle P QR:
√
1 −→ −→
1
1 √
5 82
Area = ∥P Q × P R∥ = ∥n∥ = · 5 82 =
.
2
2
2
2
√


8
3
3
5 82
=⇒ Unit vector = − √ , − √ , √
, Area =
2
82
82 82
30. Find parametric equations of line L through A = (−1, 2, 1) parallel to i + j − k.
Solution: Direction vector: v = [1, 1, −1]. Point: A = (−1, 2, 1). Parametric equations:
x = −1 + t,

y = 2 + t,

z = 1 − t,

t ∈ R.

31. Relative to a fixed origin O, the points A, B, and C have position vectors:
 
 
 
2
5
3
a =  3  , b = 1 , c =  5  .
−1
2
−3
Find:
44


−→
−→
(a) AB and AC,
(b) the angle ∠BAC to the nearest degree,
(c) the area of triangle ABC.
Solution
(a)


  
5−2
3
−→



1−3
AB = b − a =
= −2 .
2 − (−1)
3

  
3−2
1
−→



5−3
2 .
AC = c − a =
=
−3 − (−1)
−2
(b)

−→ −→
AB · AC = (3)(1) + (−2)(2) + (3)(−2) = 3 − 4 − 6 = −7.
p
√
√
−→
|AB| = 32 + (−2)2 + 32 = 9 + 4 + 9 = 22.
p
√
−→
|AC| = 12 + 22 + (−2)2 = 1 + 4 + 4 = 3.
cos θ = √

−7
≈ −0.496.
22 × 3

θ = arccos(−0.496) ≈ 120◦

(to nearest degree).

(c)
 
i j
k
−2
−→ −→
AB × AC = 3 −2 3 = i(4 − 6) − j(−6 − 3) + k(6 + 2) =  9  .
1 2 −2
8
1√
1√
1 −→ −→
1p
(−2)2 + 92 + 82 =
4 + 81 + 64 =
149 ≈ 6.10.
Area = ∥AB × AC∥ =
2
2
2
2
32. The line l1 passes through points P (2, −1, 3) and Q(5, 1, 7). The line l2 has vector equation:
 
 
4
1



r = 3 + µ −2 .
1
1
(a) Find a vector equation for l1 .
(b) Determine if l1 and l2 intersect, and if so, find the intersection point.
(c) Find the acute angle between l1 and l2 .
Solution
(a) Direction vector of l1 :
 
3
−→  
PQ = 2 .
4
Equation of l1 :



 
2
3



r = −1 + λ 2 .
3
4

45


(b) Equating coordinates:
2 + 3λ = 4 + µ
−1 + 2λ = 3 − 2µ
3 + 4λ = 1 + µ.
From first: µ = 3λ − 2. Substitute into third:
3 + 4λ = 1 + 3λ − 2 =⇒ 4λ − 3λ = 1 − 2 − 3 =⇒ λ = −4.
Then µ = 3(−4) − 2 = −14. Check second equation:
−1 + 2(−4) = −9,

3 − 2(−14) = 31 (not equal).

So lines do not intersect.
(c) Direction vectors:
 
3

d1 = 2 ,
4
|d1 | =

√




1
d2 = −2 .
1

d1 · d2 = 3 − 4 + 4 = 3.
√
√
√
9 + 4 + 16 = 29, |d2 | = 1 + 4 + 1 = 6.
3
cos ϕ = √ √ ≈ 0.227,
29 6

ϕ ≈ 77◦ .

Acute angle ≈ 77◦ .
33. Given vectors u = 2i − j + 3k and v = −i + 4j + k.
(a) Find u · v and u × v.
(b) Find the angle between u and v to the nearest degree.
(c) Verify that u × v is perpendicular to both u and v.
Solution
(a)
u · v = (2)(−1) + (−1)(4) + (3)(1) = −2 − 4 + 3 = −3.


i
j k
−13
u × v = 2 −1 3 = i(−1 − 12) − j(2 + 3) + k(8 − 1) =  −5  .
−1 4 1
7
(b)
|u| =

√

4+1+9=

√

14,

|v| =

√

−3
cos θ = √ √ ≈ −0.189,
14 18

1 + 16 + 1 =

√

18.

θ ≈ 101◦ .

(c)
u · (u × v) = (2)(−13) + (−1)(−5) + (3)(7) = −26 + 5 + 21 = 0.
v · (u × v) = (−1)(−13) + (4)(−5) + (1)(7) = 13 − 20 + 7 = 0.
Hence perpendicular.
34. Points A(4, 2, −1), B(1, 5, 3), C(2, 1, 0), and D form a parallelogram ABCD. Find:
46


(a) The coordinates of D.
(b) The area of parallelogram ABCD.
(c) The acute angle between the diagonals AC and BD.
Solution
−→ −−→
(a) In a parallelogram, AB = DC:



−3
−→  
3 .
AB =
4
Let D = (x, y, z), then:


  
2−x
−3
−−→ 


3 .
DC = 1 − y =
−z
4
So 2 − x = −3 =⇒ x = 5, 1 − y = 3 =⇒ y = −2, −z = 4 =⇒ z = −4. Thus
D(5, −2, −4).
−→ −−→
(b) Area = |AB × AD|. First:
 
1
−−→  
−4
AD =
.
−3
 
7
i
j
k
−→ −−→
4 = i(−9 + 16) − j(9 − 4) + k(12 − 3) = −5 .
AB × AD = −3 3
9
1 −4 −3
√
√
Area = 49 + 25 + 81 = 155.
−→
−−→
(c) Diagonals: AC = (−2, −1, 1), BD = (4, −7, −7).
−→ −−→
AC · BD = −8 + 7 − 7 = −8.
√
√
√
√
−→
−−→
|AC| = 4 + 1 + 1 = 6, |BD| = 16 + 49 + 49 = 114.
−8
cos ϕ = √ √
≈ −0.302,
6 114
Acute angle = 180◦ − 108◦ = 72◦ .
 
 
3
1



35. Line l1 : r = 0 + t 2 .
2
−1 
1
2



Line l2 : r = 4 + s −1.
1
3

ϕ ≈ 108◦ .

(a) Show that l1 and l2 intersect and find the point of intersection.
(b) Find the acute angle between the lines.
(c) Find the point on l1 closest to the point Q(1, 2, 3).
Solution

47


(a) Set equal:
3 + t = 1 + 2s
2t = 4 − s
2 − t = 1 + 3s.
From first: t = 2s − 2. Substitute into second:
2(2s − 2) = 4 − s =⇒ 4s − 4 = 4 − s =⇒ 5s = 8 =⇒ s = 1.6,

t = 1.2.

From Third: 2 − 1.2 = 0.8, 1 + 3(1.6) = 5.8. Not equal, so they do not intersect.
(b) Direction vectors: d1 = (1, 2, −1), d2 = (2, −1, 3).
d1 · d2 = 2 − 2 − 3 = −3.
√
√
√
√
|d1 | = 1 + 4 + 1 = 6, |d2 | = 4 + 1 + 9 = 14.
−3
cos ϕ = √ √ ≈ −0.327, ϕ ≈ 109◦ , acute ≈ 71◦ .
6 14
−→
(c) Point P on l1 : (3 + t, 2t, 2 − t). Vector QP = (2 + t, 2t − 2, −1 − t). For closest point,
−→
QP ⊥ d1 :
(2 + t)(1) + (2t − 2)(2) + (−1 − t)(−1) = 0.
1
2 + t + 4t − 4 + 1 + t = 0 =⇒ 6t − 1 = 0 =⇒ t = .
6

19 1 11
Closest point: 6 , 3 , 6 .
36. Given a = 3i − j + 2k, b = i + 2j − k, c = 2i + j + k.
(a) Find a · (b × c).
(b) Find the volume of the parallelepiped determined by a, b, and c.
(c) Find a unit vector perpendicular to both b and c.
Solution
(a)
 
3
i j k

b × c = 1 2 −1 = i(2 + 1) − j(1 + 2) + k(1 − 4) = −3 .
−3
2 1 1
a · (b × c) = (3)(3) + (−1)(−3) + (2)(−3) = 9 + 3 − 6 = 6.
(b) Volume = |a · (b × c)| = 6.
(c) A vector perpendicular to both b and c is b × c = (3, −3, −3). Magnitude:
√
√
√
9 + 9 + 9 = 27 = 3 3.
Unit vector:

  √1 
3
1
 3 
√ −3 = − √13  .
3 3 −3
− √13


48


37. Points O(0, 0, 0), A(1, 3, 2), B(2, 1, 4), C(3, 4, 1).
(a) Show that OA, OB, and OC are mutually perpendicular.
(b) Find the area of triangle ABC.
(c) Find the volume of tetrahedron OABC.
Solution
(a)

−→ −−→
OA · OB = 2 + 3 + 8 = 13 ̸= 0.
−→
−−→
Wait, check: OA = (1, 3, 2), OB = (2, 1, 4). Dot product = 2 + 3 + 8 = 13, not zero.
So not perpendicular. Let’s assume they are not perpendicular.

(b)

−→
AB = (1, −2, 2),

−→
AC = (2, 1, −1).

 
i j
k
0
−→ −→

AB × AC = 1 −2 2 = i(2 − 2) − j(−1 − 4) + k(1 + 4) = 5 .
2 1 −1
5
√
√
√
Area = 12 0 + 25 + 25 = 21 50 = 5 2 2 .
(c) Volume of tetrahedron:
1 −→ −−→ −→
Volume = |OA · (OB × OC)|.
6
First:


−15
i j k
−−→ −→
OB × OC = 2 1 4 = i(1 − 16) − j(2 − 12) + k(8 − 3) =  10  .
5
3 4 1
−→ −−→ −→
Then OA · (OB × OC) = 1(−15) + 3(10) + 2(5) = −15 + 30 + 10 = 25. Volume =
1
× 25 = 25
.
6
6
 
 
4
2



.
1
−1
38. Line l: r =
+λ
0
3
Point P (3, 5, −2).
(a) Find the foot of the perpendicular from P to l.
(b) Find the shortest distance from P to l.
Solution
(a) Let point F on l: (4 + 2λ, 1 − λ, 3λ).
−→
P F = (1 + 2λ, −4 − λ, 2 + 3λ).
−→
For perpendicular: P F · d = 0, where d = (2, −1, 3):
(1 + 2λ)(2) + (−4 − λ)(−1) + (2 + 3λ)(3) = 0.
6
2 + 4λ + 4 + λ + 6 + 9λ = 0 =⇒ 12 + 14λ = 0 =⇒ λ = − .
7
49



6
18
Foot F : 4 − 12
,
1
+
,
−
=
7
7
7

16 13
, , − 18
7 7
7


.

(b) Shortest distance:
−→
|P F | =

s

12
1−
7

2



6
+ −4 +
7

2


2
18
+ 2−
.
7

s 
√
√

2  2
2
22
4
1√
525
5 21
5
+ −
+ −
=
=
.
=
−
25 + 484 + 16 =
7
7
7
7
7
7
 
 
2
1
39. Given p = −1, q =  4 .
3
−2
(a) Find p + 2q and 3p − q.
(b) Find a vector perpendicular to both p and q.
(c) Find the angle between p and q to the nearest 0.1°.
Solution
(a)


    
2
2
4





7 .
p + 2q = −1 + 8
=
3
−4
−1
     
6
1
5





3p − q = −3 − 4
= −7 .
9
−2
11
(b)


−10
i j
k
p × q = 2 −1 3 = i(2 − 12) − j(−4 − 3) + k(8 + 1) =  7  .
9
1 4 −2
(c)
p · q = 2 − 4 − 6 = −8.
√
√
√
√
|p| = 4 + 1 + 9 = 14, |q| = 1 + 16 + 4 = 21.
−8
cos θ = √ √ ≈ −0.466,
14 21

θ ≈ 117.8◦ .

40. Points A(1, 2, 3), B(4, 5, 6), C(7, 8, 9).
(a) Show that A, B, and C are collinear.
Solution
(a)

−→
AB = (3, 3, 3),

Hence collinear.
 
 
3
1
41. Given a = −2, b =  4 .
1
−3

50

−→
−→
AC = (6, 6, 6) = 2AB.


(a) Find projb a.
Solution
(a)
projb a =

a·b
b.
|b|2

a · b = 3 − 8 − 3 = −8.
|b|2 = 1 + 16 + 9 = 26.
Projection vector:
  4
1
−
−8    13
16 
4
.
= − 13
26
12
−3
13


42. Triangle ABC with A(2, 1, 0), B(3, 4, 5), C(1, 3, 2).
(a) Find the lengths AB, BC, and CA.
Solution
(a)

p
√
√
AB = (1)2 + (3)2 + (5)2 = 1 + 9 + 25 = 35.
p
√
√
BC = (−2)2 + (−1)2 + (−3)2 = 4 + 1 + 9 = 14.
p
√
CA = (1)2 + (2)2 + (2)2 = 1 + 4 + 4 = 3.
 
 
 
2
1
0





0 , v = 1 , w = 2.
43. Given u =
−1
1
1
(a) Find (u × v) × w.
(b) Find u × (v × w).
(c) Verify the vector triple product identity.
Solution
(a)
 
i j k
1

u × v = 2 0 −1 = i(0 + 1) − j(2 + 1) + k(2 − 0) = −3 .
1 1 1
2
 
i j k
−7
(u × v) × w = 1 −3 2 = i(−3 − 4) − j(1 − 0) + k(2 − 0) = −1 .
0 2 1
2
(b)
 
i j k
−1

v × w = 1 1 1 = i(1 − 2) − j(1 − 0) + k(2 − 0) = −1 .
0 2 1
2
 
i
j
k
−1

0 −1 = i(0 − 1) − j(4 − 1) + k(−2 − 0) = −3 .
u × (v × w) = 2
−1 −1 2
−2

51


(c) Triple product identity: u × (v × w) = (u · w)v − (u · v)w. Compute:
u · w = 0 + 0 − 1 = −1, u · v = 2 + 0 − 1 = 1.
     
1
0
−1





(−1)v − (1)w = − 1 − 2 = −3 .
1
1
−2
Matches part (b).
44. Points A(1, 0, 1), B(2, 2, 0), C(0, 1, 3).
(a) Find the equation of the plane through A, B, and C.
(b) Find the distance from the origin to this plane.
(c) Find the acute angle between the plane and the plane 2x − y + z = 5.
Solution
−→
−→
(a) Vectors in plane: AB = (1, 2, −1), AC = (−1, 1, 2). Normal vector:
 
i j k
5
−→ −→
n = AB × AC = 1 2 −1 = i(4 + 1) − j(2 − 1) + k(1 + 2) = −1 .
−1 1 2
3
Plane equation: 5(x − 1) − 1(y − 0) + 3(z − 1) = 0 =⇒ 5x − y + 3z − 8 = 0.
(b) Distance from origin:
8
|0 − 8|
√
=√ .
25 + 1 + 9
35
(c) Angle between planes = angle between normals: n1 = (5, −1, 3), n2 = (2, −1, 1).
n1 · n2 = 10 + 1 + 3 = 14.
√
√
|n1 | = 35, |n2 | = 6.
14
cos θ = √ √ ≈ 0.967, θ ≈ 15◦ .
35 6
45. Check if B = (0, 3, 0), C = (1, 1, 1), D = (−2, 1, 2) belong to L.
Solution: For point B = (0, 3, 0):


0 = −1 + t =⇒ t = 1
3 = 2 + t =⇒ t = 1


0 = 1 − t =⇒ t = 1
All equations give t = 1, so B ∈ L.
For point C = (1, 1, 1):


1 = −1 + t =⇒ t = 2
1 = 2 + t =⇒ t = −1


1 = 1 − t =⇒ t = 0
Inconsistent t values, so C ∈
/ L.
For point D = (−2, 1, 2):


−2 = −1 + t =⇒ t = −1
1 = 2 + t =⇒ t = −1


2 = 1 − t =⇒ t = −1
All equations give t = −1, so D ∈ L.
52


46. Show L and L′ (x = 1 + 2s, y = 3, z = −2 + s) are skew lines.
Solution: L: direction v1 = [1, 1, −1], point A = (−1, 2, 1). L′ : direction v2 = [2, 0, 1],
point B = (1, 3, −2).
Check if parallel: v1 not scalar multiple of v2 (no k such that [1, 1, −1] = k[2, 0, 1]).
Check if they intersect: Solve system:


−1 + t = 1 + 2s
2+t=3


1 − t = −2 + s
From second: 2 + t = 3 =⇒ t = 1. Substitute into first: −1 + 1 = 1 + 2s =⇒ 0 =
1 + 2s =⇒ s = − 21 . Check third: 1 − 1 = −2 + (− 12 ) =⇒ 0 = − 52 (false).
No intersection and not parallel, so they are skew lines.
47. Show planes P : 2x + 2y − z − 10 = 0 and P ′ : 32 x − y + z = 0 are perpendicular.


Solution: Normal vectors: n1 = [2, 2, −1], n2 = 23 , −1, 1 . Planes are perpendicular if
n1 · n2 = 0:
3
n1 · n2 = 2 · + 2 · (−1) + (−1) · 1 = 3 − 2 − 1 = 0.
2
Since dot product is zero, the planes are perpendicular.
48. Find angle between planes 2x + 3y + 4z = 5 and 2x − 6y − 3z = 0.
Solution: Normal vectors: n1 = [2, 3, 4], n2 = [2, −6, −3].
cos θ =

|n1 · n2 |
.
∥n1 ∥∥n2 ∥

Compute:
n1 · n2 = 2 · 2 + 3 · (−6) + 4 · (−3) = 4 − 18 − 12 = −26.
√
√
√
∥n1 ∥ = 22 + 32 + 42 = 4 + 9 + 16 = 29.
p
√
√
∥n2 ∥ = 22 + (−6)2 + (−3)2 = 4 + 36 + 9 = 49 = 7.
| − 26|
26
cos θ = √
= √ .
29 · 7
7 29


26
√
≈ cos−1 (0.690) ≈ 46.4◦ .
θ = cos−1
7 29
√
49. Find component of F = 2i − j + 2k in direction of n = i + j + k 2.
Solution: The component of F in direction of n is the scalar projection:
compn F =
Compute:

F·n
.
∥n∥

√
√
√
F · n = 2 · 1 + (−1) · 1 + 2 · 2 = 2 − 1 + 2 2 = 1 + 2 2.
q
√
√
√
∥n∥ = 12 + 12 + ( 2)2 = 1 + 1 + 2 = 4 = 2.
√
1+2 2
compn F =
.
2
53


Part III
MATRICES

54



1. Solve for X: 2X + A = B where A =




1 2
3 4
,B=
.
−1 0
1 2

Solution:

 
 

3 4
1 2
2 2
2X = B − A =
−
=
1 2
−1 0
2 2

 

1 2 2
1 1
=
X=
2
2
1 1
2
2. Find x and y such that:


1 2
3 4

   
x
5
=
y
11

Solution:

  
  
1 2
x
x + 2y
5
=
=
3 4
y
3x + 4y
11
System: x + 2y = 5 (1)
3x + 4y = 11 (2)
From (1): x = 5 − 2y
Substitute into (2): 3(5 − 2y) + 4y = 11
15 − 6y + 4y = 11
− 2y = −4 ⇒ y = 2
x = 5 − 2(2) = 1


2 3 1
3. Find det(A) for A = 0 4 5.
1 0 3
Solution:
4 5
0 5
0 4
det(A) = 2 ·
−3·
+1·
0 3
1 3
1 0
= 2(4 · 3 − 5 · 0) − 3(0 · 3 − 5 · 1) + 1(0 · 0 − 4 · 1)
= 2(12) − 3(−5) + 1(−4)
= 24 + 15 − 4 = 35




3 2
5 −2
4. Verify that B =
is the inverse of A =
.
−7 3
7 5
Solution:



5 −2
3 2
AB =
−7 3
7 5


5 · 3 + (−2) · 7 5 · 2 + (−2) · 5
=
−7 · 3 + 3 · 7
−7 · 2 + 3 · 5

 

15 − 14
10 − 10
1 0
=
=
−21 + 21 −14 + 15
0 1



3 2
5 −2
BA =
7 5
−7 3


3 · 5 + 2 · (−7) 3 · (−2) + 2 · 3
=
7 · 5 + 5 · (−7) 7 · (−2) + 5 · 3

 

15 − 14 −6 + 6
1 0
=
=
35 − 35 −14 + 15
0 1
55


5. Construct a 3 × 3 symmetric matrix with a11 = 1, a12 = 2, a13 = 3, a22 = 4, a23 = 5, a33 = 6.
Solution: For symmetry: aji = aij .



1 2 3
A = 2 4 5
3 5 6

6. Verify that Q =

√1
2
− √12

√1
2
√1
2

!
is orthogonal.

Solution:
QQ =

1

+ 21
2
1
− 21
2

=


2
1−i
1+i
3

7. Show H =

!

√1
2
√1
2

√1
2
− √12

1
− 12
2
1
+ 12
2





√1
2
− √12

√1
2
√1
2

T

=

!

1 0
0 1




is Hermitian.

Solution:
∗


T 
2
1−i
2
1+i
=
=H
1+i
3
1−i
3



T

H =H =



1 1
8. Compute A where A =
and deduce pattern.
0 1
3

Solution:


1 2
A =
0 1
2



 

1 2
1 1
1 3
A =A ·A=
=
0 1
0 1
0 1


1 n
Pattern: An =
0 1
3


9. For A =

2




1 2
5 6
,B=
, verify trace(A + B) = trace(A) + trace(B).
3 4
7 8

Solution:
trace(A) = 1 + 4 = 5
trace(B) = 5 + 8 = 13


6 8
A+B =
10 12
trace(A + B) = 6 + 12 = 18
5 + 13 = 18



1 2 3
10. Find rank of A = 2 4 6.
1 1 1
56


Solution:
The rank of a matrix is the maximum number of linearly independent rows (or columns) in
the matrix.


1 2 3
R2 → R2 − 2R1 : 0 0 0
1 1 1


1 2
3
0
R3 → R3 − R1 : 0 0
0 −1 −2
Non-zero rows: 2 ⇒ rank(A) = 2

11. Check if P =


0.5 0.5
is idempotent.
0.5 0.5

Solution:
A matrix is idempotent if P 2 = P .




0.5 0.5
0.5 0.5
P =
0.5 0.5
0.5 0.5

 

0.25 + 0.25 0.25 + 0.25
0.5 0.5
=
=
=P
0.25 + 0.25 0.25 + 0.25
0.5 0.5
2




0 1 0
12. Show N = 0 0 1 is nilpotent of index 3.
0 0 0
Solution:
A matrix N is nilpotent of index k if N k = 0 and N k−1 ̸= 0.




 

0 1 0
0 1 0
0 0 1
N 2 = 0 0 1 0 0 1 = 0 0 0 ̸= 0
0 0 0
0 0 0
0 0 0


 

0 0 1
0 1 0
0 0 0
N 3 = N 2 · N = 0 0 0 0 0 1 = 0 0 0 = 0
0 0 0
0 0 0
0 0 0

13. For A =




1 0
2 1
,B=
, verify det(AB) = det(A) det(B).
3 4
2 1

Solution:
det(A) = 2 · 4 − 1 · 3 = 8 − 3 = 5
det(B) = 1 · 1 − 0 · 2 = 1


 

2 1
1 0
4 1
AB =
=
3 4
2 1
11 4
det(AB) = 4 · 4 − 1 · 11 = 16 − 11 = 5
det(A) det(B) = 5 · 1 = 5
57


T

T



T

14. Verify (AB) = B A for A =




1 2
5 6
,B=
.
3 4
7 8

Solution:



5
AB =
7


19 43
(AB)T =
22 50


5 7
1
T T
B A =
6 8
2
1 2
3 4

6
8





19 22
=
43 50

3
4





19 43
=
22 50

(
2x + y = 5
15. Solve using matrices:
x − 3y = 6
Solution:

   
2 1
x
5
=
1 −3
y
6
det = 2(−3) − 1(1) = −6 − 1 = −7
5 1
6 −3
5(−3) − 1(6)
−15 − 6
−21
=
=
=
=3
x=
−7
−7
−7
−7
2 5
1 6
2(6) − 5(1)
12 − 5
7
y=
=
=
=
= −1
−7
−7
−7
−7



2 1 1
16. Find A−1 for A = 3 2 1.
2 1 2
Solution:
det(A) = 2

2 1
3 1
3 2
−1
+1
1 2
2 2
2 1

= 2(4 − 1) − 1(6 − 2) + 1(3 − 4)
= 2(3) − 1(4) + 1(−1) = 6 − 4 − 1 = 1


3 −4 −1
0
Cofactor matrix: C = −1 2
−1 1
1


3 −1 −1
1
adj(A) = C T = −4 2
−1 0
1


3 −1 −1
1
1
A−1 = adj(A) = −4 2
1
−1 0
1

17. Find eigenvalues of A =


4 1
.
2 3

58


Solution:
det(A − λI) =

4−λ
1
2
3−λ

= (4 − λ)(3 − λ) − 2 · 1
= λ2 − 7λ + 12 − 2
= λ2 − 7λ + 10 = 0
√
7 ± 49 − 40
7±3
λ=
=
2
2
λ1 = 5, λ2 = 2
18. Find the eigenvalues and eigenvectors of:



10 −2 4
A = −20 4 −10
−30 6 −13

Solution
Step 1: Find the characteristic equation

det(A − λI) =

10 − λ −2
4
−20 4 − λ
−10
=0
−30
6
−13 − λ

Expanding:

(10 − λ)

4−λ
−10
−20
−10
−20 4 − λ
− (−2)
+4
=0
6
−13 − λ
−30 −13 − λ
−30
6

First term: (10 − λ)[(4 − λ)(−13 − λ) + 60]
Second term: +2[(−20)(−13−λ)−(−10)(−30)] = 2[260+20λ−300] = 2[20λ−40] = 40λ−80
Third term: 4[(−20)(6)−(4−λ)(−30)] = 4[−120+30(4−λ)] = 4[−120+120−30λ] = −120λ
First term expansion: (4 − λ)(−13 − λ) = −52 − 4λ + 13λ + λ2 = λ2 + 9λ − 52
Adding +60: λ2 + 9λ − 52 + 60 = λ2 + 9λ + 8 = (λ + 1)(λ + 8)
So first term: (10 − λ)(λ + 1)(λ + 8)
Therefore:
(10 − λ)(λ + 1)(λ + 8) + (40λ − 80) + (−120λ) = 0
(10 − λ)(λ + 1)(λ + 8) − 80λ − 80 = 0
(10 − λ)(λ + 1)(λ + 8) − 80(λ + 1) = 0
(λ + 1)[(10 − λ)(λ + 8) − 80] = 0
(λ + 1)[10λ + 80 − λ2 − 8λ − 80] = 0
(λ + 1)[−λ2 + 2λ] = 0
(λ + 1)(−λ)(λ − 2) = 0

59


Step 2: Identify the eigenvalues
λ1 = 0,

λ2 = −1,

λ3 = 2

Step 3: Find the eigenvectors
For λ = 0:


   
10 −2 4
x
0





y = 0
AX = −20 4 −10
−30 6 −13
z
0
This gives:
10x − 2y + 4z = 0 ... (1)
−20x + 4y − 10z = 0 ... (2)
−30x + 6y − 13z = 0 ... (3)
From (1): 5x − y + 2z = 0 ⇒ y = 5x + 2z
From (2): −20x + 4(5x + 2z) − 10z = −20x + 20x + 8z − 10z = −2z = 0 ⇒ z = 0
Then y = 5x
From (3): −30x + 6(5x) − 13(0) = −30x + 30x = 0 (consistent)
Let x = t (arbitrary), then y = 5t, z = 0
 
 
t
1
X1 = 5t = t 5
0
0
√
√
Normalized eigenvector: Magnitude = 12 + 52 + 02 = 26
 
1
1  
5
X̂1 = √
26 0
For λ = −1:


   
11 −2 4
x
0





y = 0
(A + I)X = −20 5 −10
−30 6 −12
z
0
This gives:
11x − 2y + 4z = 0 ... (1)
−20x + 5y − 10z = 0 ... (2)
−30x + 6y − 12z = 0 ... (3)
From (2): divide by -5: 4x − y + 2z = 0 ⇒ y = 4x + 2z
Substitute into (1): 11x − 2(4x + 2z) + 4z = 11x − 8x − 4z + 4z = 3x = 0 ⇒ x = 0
Then y = 2z
From (3): −30(0) + 6(2z) − 12z = 12z − 12z = 0 (consistent)
60


Let z = t (arbitrary), then x = 0, y = 2t
 
 
0
0



X2 = 2t = t 2
t
1
√
√
Normalized eigenvector: Magnitude = 02 + 22 + 12 = 5
 
0
1  
2
X̂2 = √
5 1
For λ = 2:


   
8 −2 4
x
0





y = 0
(A − 2I)X = −20 2 −10
−30 6 −15
z
0
This gives:
8x − 2y + 4z = 0 ... (1)
−20x + 2y − 10z = 0 ... (2)
−30x + 6y − 15z = 0 ... (3)
From (1): divide by 2: 4x − y + 2z = 0 ⇒ y = 4x + 2z
From (2): −20x + 2(4x + 2z) − 10z = −20x + 8x + 4z − 10z = −12x − 6z = 0 ⇒ −6(2x + z) =
0 ⇒ z = −2x
Then y = 4x + 2(−2x) = 4x − 4x = 0
From (3): −30x + 6(0) − 15(−2x) = −30x + 30x = 0 (consistent)
Let x = t (arbitrary), then y = 0, z = −2t



 
t
1
X3 =  0  = t  0 
−2t
−2
p
√
Normalized eigenvector: Magnitude = 12 + 02 + (−2)2 = 5



1
1
X̂3 = √  0 
5 −2
19. Find the eigenvalues and eigenvectors of the matrix:


2 −1 0
A = −1 2 −1
0 −1 2

61


Solution
Step 1: Find the characteristic equation
2 − λ −1
0
det(A − λI) = −1 2 − λ −1 = 0
0
−1 2 − λ
Expanding:
2 − λ −1
−1 −1
−1 2 − λ
− (−1)
+0
=0
−1 2 − λ
0 2−λ
0
−1

(2 − λ)

(2 − λ)[(2 − λ)2 − 1] + 1[(−1)(2 − λ) − (−1)(0)] = 0
(2 − λ)[(2 − λ)2 − 1] + 1[−(2 − λ)] = 0
(2 − λ)[(2 − λ)2 − 1 − 1] = 0
(2 − λ)[(2 − λ)2 − 2] = 0
(2 − λ)[4 − 4λ + λ2 − 2] = 0
(2 − λ)[λ2 − 4λ + 2] = 0
Step 2: Solve for eigenvalues
From (2 − λ) = 0, we get λ = 2
From λ2 − 4λ + 2 = 0:
λ=

4±

√
√
√
√
4± 8
4±2 2
16 − 8
=
=
=2± 2
2
2
2

Therefore:
λ1 = 2 −

√

2,

λ2 = 2,

λ3 = 2 +

√

2

Step 3: Find the eigenvectors
√
For λ = 2 − 2:
√

   
2 − (2 − 2)
−1 √
0
x
0





y = 0
(A − λI)X =
−1
2 − (2 − 2)
−1 √
z
0
0
−1
2 − (2 − 2)
√
√
Simplifying: 2 − (2 − 2) = 2
So:

√
   
2 √
−1 0
x
0
−1




y = 0
2 √
−1
z
0
0 −1
2

This gives:
√

2x − y = 0
√
−x + 2y − z = 0
√
−y + 2z = 0

√

⇒

y=

⇒

√
y
2x
z= √ = √ =x
2
2

62

2x


√ √
Substitute into second equation: −x + 2( 2x) − x = −x + 2x − x = 0 (consistent)
√
Let x = t (arbitrary), then y = 2t, z = t



 
t
√
√1



X1 =
2t = t
2
t
1
q
√
√
√
Normalized eigenvector: Magnitude = 12 + ( 2)2 + 12 = 1 + 2 + 1 = 4 = 2

1
1 √
X̂1 =  2
2
1


For λ = 2:


   
0 −1 0
x
0
(A − 2I)X = −1 0 −1 y  = 0
0 −1 0
z
0
This gives:
−y = 0 ⇒ y = 0
−x − z = 0 ⇒ x = −z
−y = 0 (consistent)
Let x = t (arbitrary), then z = −t, y = 0



 
t
1



X2 = 0 = t 0 
−t
−1
p
√
Normalized eigenvector: Magnitude = 12 + 02 + (−1)2 = 2



1
1
X̂2 = √  0 
2 −1
For λ = 2 +

√

2:

√
   
2 − (2 + 2)
−1 √
0
x
0





y
(A − λI)X =
= 0
−1
2 − (2 + 2)
−1 √
z
0
0
−1
2 − (2 + 2)
√
√
Simplifying: 2 − (2 + 2) = − 2


So:

 √
   
− 2 −1
0
x
0
√
 −1 − 2 −1  y  = 0
√
z
0
0
−1 − 2

63


This gives:

√
− 2x − y = 0
√
−x − 2y − z = 0
√
−y − 2z = 0

√
y = − 2x

⇒

√
y
(− 2x)
⇒ z = −√ = − √
=x
2
2
√
√
Substitute into second equation: −x − 2(− 2x) − x = −x + 2x − x = 0 (consistent)
√
Let x = t (arbitrary), then y = − 2t, z = t





t
1
√
√
X3 = − 2t = t − 2
t
1
q
√
√
√
Normalized eigenvector: Magnitude = 12 + (− 2)2 + 12 = 1 + 2 + 1 = 4 = 2

X̂3 =

1
√



1
− 2
2
1



2 1
20. If A =
, find A2 − 3A + 2I.
0 1
Solution:


 

2 1
2 1
4 3
A =
=
0 1
0 1
0 1




6 3
2 0
3A =
, 2I =
0 3
0 2

 
 

4 3
6 3
2 0
2
A − 3A + 2I =
−
+
0 1
0 3
0 2

 

4−6+2 3−3+0
0 0
=
=
0−0+0 1−3+2
0 0

1
1
1
2

√

√

√

2
6

 3
21. Show that the columns of Q =  √13 − √12 √16  are orthonormal.
√1
0
− √26
3

Solution:
Let q1 , q2 , q3 be columns.
1 1 1
+ + =1
3 3 3
1 1
q 2 · q2 = + + 0 = 1
2 2
1 1 4
q 3 · q3 = + + = 1
6 6 6
1
1
q 1 · q2 = √ − √ + 0 = 0
6
6
1
1
2
q 1 · q3 = √ + √ − √ = 0
18
18
18
1
1
q 2 · q3 = √ − √ + 0 = 0
12
12
q 1 · q1 =

64



22. For Z =


1 + i 2i
, find Z + Z.
3−i 4

Solution:


1 − i −2i
Z=
3+i 4

 

1 + i + 1 − i 2i − 2i
2 0
Z +Z =
=
3−i+3+i 4+4
6 8


1 2 3
23. Find k such that A = 2 k 6 is singular.
3 6 9
Solution:
det(A) = 1

k 6
2 6
2 k
−2
+3
6 9
3 9
3 6

= 1(9k − 36) − 2(18 − 18) + 3(12 − 3k)
= 9k − 36 + 0 + 36 − 9k = 0
det(A) = 0 for all k

24. Find X such that AX = B where A =




1 2
5 6
,B=
.
3 4
7 8

Solution:
det(A) = 4 − 6 = −2

 

1 4 −2
−2 1
−1
A =−
= 3
− 12
2 −3 1
2



−2 1
5 6
−1
X=A B= 3
− 21
7 8
2

 

−10 + 7 −12 + 8
−3 −4
= 15 7
=
−2
9−4
4
5
2






A 0
1 2
5 6
25. Find det
where A =
,B=
.
7 8
0 B
3 4
Solution:


A 0
det
0 B


= det(A) · det(B)

det(A) = 4 − 6 = −2
det(B) = 40 − 42 = −2
Product = (−2)(−2) = 4

26. Find all 2 × 2 matrices that commute with A =

65


1 2
.
0 1




a b
Solution: Let B =
.
c d

1
AB =
0

a
BA =
c


a
c

b
1
d
0

2
1

 

b
a + 2c b + 2d
=
d
c
d
 

2
a 2a + b
=
1
c 2c + d

Equate: a + 2c = a ⇒ c = 0
b + 2d = 2a + b ⇒ d = a


a b
Thus: B =
0 a
−1 T

T −1

27. Show (A ) = (A )



2 1
for A =
.
1 1

Solution:

1 −1
A =
−1 2

T 

1 −1
1 −1
−1 T
(A ) =
=
−1 2
−1 2


2 1
AT =
1 1


1 −1
T −1
(A ) =
−1 2
−1



(A−1 )T = (AT )−1
28. Show A − AT is skew-symmetric for any square A.
Solution:
A matrix is skew-symmetric if B T = −B.
Let B = A − AT .
B T = (A − AT )T = AT − (AT )T = AT − A = −(A − AT ) = −B


3 2 1
29. Question: Find characteristic polynomial of 0 1 4
2 0 5
Solution:

3−λ
2
1
0
1−λ
4
det(A − λI) =
2
0
5−λ

Expand along first row:
= (3 − λ)

1−λ
4
0
4
0 1−λ
−2
+1
0
5−λ
2 5−λ
2
0

= (3 − λ)[(1 − λ)(5 − λ) − 0] − 2[0(5 − λ) − 8] + 1[0 − 2(1 − λ)]
= (3 − λ)(λ2 − 6λ + 5) + 16 − 2(1 − λ)
= 3λ2 − 18λ + 15 − λ3 + 6λ2 − 5λ + 16 − 2 + 2λ
= −λ3 + 9λ2 − 21λ + 29
66




2 3 1
30. Question: Find inverse of 1 2 3
3 1 2
Solution: First det A = 2

2 3
1 3
1 2
−3
+1
1 2
3 2
3 1

= 2(4 − 3) − 3(2 − 9) + 1(1 − 6) = 2 + 21 − 5 = 18
2 3
1 3
1 2
= 1 C12 = −
= −(2 − 9) = 7 C13 = +
= 1 − 6 = −5
1 2
3 2
3 1
3 1
2 1
2 3
C21 = −
= −(6 − 1) = −5 C22 = +
= 4 − 3 = 1 C23 = −
= −(2 − 9) = 7
1 2
3 2
3 1
3 1
2 1
2 3
C31 = +
= 9 − 2 = 7 C32 = −
= −(6 − 1) = −5 C33 = +
=4−3=1
2 3
1 3
1 2


1 −5 7
1 −5
adj(A) =  7
−5 7
1


1 −5 7
1 
7
1 −5
A−1 =
18
−5 7
1


4 −1 0
31. Question: Diagonalize A = 1 2 0
0 0 3
Cofactors: C11 = +

Solution: Characteristic polynomial:
4 − λ −1
0
4 − λ −1
1
2−λ
0
= (3 − λ)
det(A − λI) =
1
2−λ
0
0
3−λ
= (3 − λ)[(4 − λ)(2 − λ) + 1] = (3 − λ)(λ2 − 6λ + 9) = (3 − λ)3
λ = 3 (triple). Solve (A − 3I)v = 0:


1 −1 0
1 −1 0 v = 0 ⇒ x = y, z free
0 0 0
Two eigenvectors: v1 = [1, 1, 0]T , v2 = [0, 0, 1]T Geometric multiplicity = 2 < 3, so not
diagonalizable.


3 1 0 0
2 4 1 0

32. Question: Find characteristic polynomial of 
0 1 5 2
0 0 3 6
Solution:



3−λ
1
0
0
 2
4−λ
1
0 

det 
 0
1
5−λ
2 
0
0
3
6−λ

67


Expand via first row:
4−λ
1
0
2
1
0
5−λ
2 −1 0 5−λ
2
= (3 − λ) 1
0
3
6−λ
0
3
6−λ
First determinant: (4−λ)[(5−λ)(6−λ)−6]−1[1(6−λ)−0]+0 = (4−λ)(λ2 −11λ+24)−(6−λ)
Second determinant: 2[(5 − λ)(6 − λ) − 6] = 2(λ2 − 11λ + 24) After expansion:
−λ4 + 18λ3 − 107λ2 + 210λ − 100





1 0
0 1
33. Question: If A =
,B=
, find eigenvalues of A + B
0 2
1 0




1 1
1−λ
1
Solution: A + B =
Characteristic polynomial: det
= λ2 − 3λ + 1 = 0
1 2
1
2−λ
√
λ = 3±2 5 ≈ 2.618, 0.382

68


Determine if the following matrices A to J are Hermitian:
34.




2
1+i
3
4
2 − 3i
A = 1 − i
3
2 + 3i
5
Solution




2
1−i
3
4
2 + 3i
AT = 1 + i
3
2 − 3i
5


2
1+i
3
4
2 − 3i
A∗ = AT = 1 − i
3
2 + 3i
5

By comparison, we see that A = A∗ , so the matrix is Hermitian.
35.




3
2 − i 1 + 2i
0
4i 
B =2+i
1 − 2i −4i
−2
Solution




3
2 + i 1 − 2i
0
−4i 
BT =  2 − i
1 + 2i 4i
−2


3
2 − i 1 + 2i
0
4i 
B∗ = BT =  2 + i
1 − 2i −4i
−2

Since B = B ∗ , the matrix is Hermitian.
36.




1
i
0
2
1 + i
C = −i
0 1−i
3
Solution



1 −i
0
2
1 − i
CT = i
0 1+i
3


1
i
0
2
1 + i
C ∗ = C T = −i
0 1−i
3

Since C = C ∗ , the matrix is Hermitian.
37.




4
2 + 3i 1 − i
5
2 + i
D = 2 − 3i
1+i 2−i
6

69


Solution




4
2 − 3i 1 + i
5
2 − i
DT = 2 + 3i
1−i 2+i
6


4
2 + 3i 1 − i
5
2 + i
D∗ = DT = 2 − 3i
1+i 2−i
6

Since D = D∗ , the matrix is Hermitian.
38.




0
1 + i 2 − 3i
0
4 + 2i
E =1−i
2 + 3i 4 − 2i
0
Solution




0
1 − i 2 + 3i
0
4 − 2i
ET =  1 + i
2 − 3i 4 + 2i
0


0
1 + i 2 − 3i
0
4 + 2i
E∗ = ET =  1 − i
2 + 3i 4 − 2i
0

Since E = E ∗ , the matrix is Hermitian
39.




2
1+i 3−i
3
2 + 2i
F = 1 − i
3 + i 2 − 2i
4
Solution




2
1−i 3+i
3
2 − 2i
F T = 1 + i
3 − i 2 + 2i
4


2
1+i 3−i
3
2 + 2i
F ∗ = F T = 1 − i
3 + i 2 − 2i
4

Since F = F ∗ , the matrix is Hermitian.
40.




2i
1+i
0
3i
2 − 3i
G = 1 − i
0
2 + 3i −4i
Solution




2i
1−i
0
3i
2 + 3i
GT = 1 + i
0
2 − 3i −4i


−2i 1 + i
0
G∗ = GT = 1 − i −3i 2 − 3i
0
2 + 3i
4i

Comparing G and G∗ : we see that g11 = 2i but (G∗ )11 = −2i, so G ̸= G∗ . Therefore, the
matrix is not Hermitian.
70


41.




5
2 − i 1 + 4i
7
3 − 2i
H =2+i
1 − 4i 3 + 2i
9
Solution




5
2 + i 1 − 4i
7
3 + 2i
HT =  2 − i
1 + 4i 3 − 2i
9


5
2 − i 1 + 4i
7
3 − 2i
H∗ = HT =  2 + i
1 − 4i 3 + 2i
9

Since H = H ∗ , the matrix is Hermitian.
42.




1
1 + i 2 − 2i
2
3 + 3i
I =1−i
2 + 2i 3 − 3i
4
Solution




1
1 − i 2 + 2i
2
3 − 3i
IT =  1 + i
2 − 2i 3 + 3i
4


1
1 + i 2 − 2i
2
3 + 3i
I∗ = IT =  1 − i
2 + 2i 3 − 3i
4

Since I = I ∗ , the matrix is Hermitian.
43.




2
3 + i 1 − 2i
4
5+i
J =3−i
1 + 2i 5 − i
6
Solution




2
3 − i 1 + 2i
4
5−i
JT =  3 + i
1 − 2i 5 + i
6


2
3 + i 1 − 2i
4
5+i
J∗ = JT =  3 − i
1 + 2i 5 − i
6

Since J = J ∗ , the matrix is Hermitian.

71


Determine if the following matrices A to J are orthogonal:
44.









cos θ − sin θ
A=
sin θ cos θ
Solution

cos θ sin θ
A =
− sin θ cos θ
T

Compute AT A:


cos θ sin θ cos θ − sin θ
A A=
− sin θ cos θ sin θ cos θ


cos2 θ + sin2 θ
− cos θ sin θ + sin θ cos θ
=
− sin θ cos θ + cos θ sin θ
sin2 θ + cos2 θ


1 0
=
=I
0 1
T



Since AT A = I, the matrix is orthogonal. This is the standard rotation matrix.
45.

√1
2
B = − √12



0

√1
2
√1
2

0


0
0
1

Solution Check column norms:

2 
2
1
1 1
1
2
∥c1 ∥ = √
+ −√
+ 02 = + + 0 = 1
2 2
2
2

2 
2
1
1
1 1
∥c2 ∥2 = √
+ √
+ 02 = + + 0 = 1
2 2
2
2
2
2
2
2
∥c3 ∥ = 0 + 0 + 1 = 1
Check dot products between distinct columns:


 


1
1
1
1
1 1
√
√
c1 · c2 = √
+ −√
+ (0)(0) = − = 0
2 2
2
2
2
2




1
1
c1 · c3 = √ (0) + − √ (0) + (0)(1) = 0
2
2




1
1
c2 · c3 = √ (0) + √ (0) + (0)(1) = 0
2
2
All columns have norm 1 and are mutually orthogonal. Therefore, the matrix is orthogonal.
46.



1 0 0
C = 0 0 1
0 1 0
Solution



1 0 0
C T = 0 0 1 = C
0 1 0
72


Compute C T C:



1 0 0 1 0 0
C T C = 0 0 1 0 0 1
0 1 0 0 1 0


1·1+0·0+0·0 1·0+0·0+0·1 1·0+0·1+0·0
= 0 · 1 + 0 · 0 + 1 · 0 0 · 0 + 0 · 0 + 1 · 1 0 · 0 + 0 · 1 + 1 · 0
0·1+1·0+0·0 0·0+1·0+0·1 0·0+1·1+0·0


1 0 0
= 0 1 0 = I
0 0 1
Since C T C = I, the matrix is orthogonal. This is a permutation matrix.
47.

1



√1
2
− √12

√

 3
D =  √13
√1
3

√1
6

√1 
6
− √26

0

Solution Check column norms:

2 
2 
2
1
1
1
1 1 1
2
∥c1 ∥ = √
+ √
+ √
= + + =1
3 3 3
3
3
3

2 
2
1
1
1 1
∥c2 ∥2 = √
+ −√
+ 02 = + + 0 = 1
2 2
2
2

2 
2 
2
1
1
2
1 1 4
∥c3 ∥2 = √
+ √
+ −√
= + + =1
6 6 6
6
6
6
Check dot products:


1
1
1
1
1
1
1
c1 · c2 = √ · √ + √ · − √
+ √ ·0= √ − √ =0
3
2
3
2
3
6
6


1
1
1
1
2
1
2
1
1
c1 · c3 = √ · √ + √ · √ + √ · − √
= √ +√ −√ =0
3
6
3
6
3
6
18
18
18




1
1
1
2
1
1
1
c2 · c3 = √ · √ + − √
· √ + 0 · −√
= √ −√ =0
2
6
2
6
6
12
12
All columns are orthonormal. Therefore, the matrix is orthogonal.
48.

"
E=

Solution

"
ET =

1
√2
3
2

1
√2
3
2

73

√

3
2
− 12

√

3
2
− 21

#

#
=E


Compute E T E:
√

"

1
√2
3
2

"

1
+ 34√
√4
3
− 43
4

ET E =
=

3
2
− 12

√ #
3
1
2
√2
3
− 12
2
√
√ #
3
3
−
4
4
3
+ 14
4

#"




1 0
=
=I
0 1
Since E T E = I, the matrix is orthogonal. This is a reflection matrix.
49.

4
5

3
5
4
5

F =

Solution

3

T

5
4
5

F =



− 53
4
5


=F

− 35

Compute F T F :
F

T

4
F = 54 5 3
−5
 59
+ 16
25
25
= 12
− 12
25
25

3

4
5
5
4
− 35
5

12
12
−
25
25
16
9
+ 25
25

 3





1 0
=
=I
0 1
Since F T F = I, the matrix is orthogonal.
50.



1 1 0
G = 1 −1 0
0 0 1
Solution Check column norms:
∥c1 ∥2 = 12 + 12 + 02 = 1 + 1 + 0 = 2 ̸= 1
∥c2 ∥2 = 12 + (−1)2 + 02 = 1 + 1 + 0 = 2 ̸= 1
Since
columns
are not unit vectors, the matrix is not orthogonal.


2 0 0
0 2 0 ̸= I)
0 0 1

51.



√1
2


H= 0
− √12

74

√1
3
− √13
√1
3



√1
6

√2 
6
√1
6

(Note: GT G =


Solution Check column norms:
2

2

1
1
1
1
2
2
+ 0 + −√
= +0+ =1
∥c1 ∥ = √
2
2
2
2

2 
2 
2
1
1
1
1 1 1
∥c2 ∥2 = √
+ −√
+ √
= + + =1
3 3 3
3
3
3
2 
2 
2

1
2
1
1 4 1
+ √
+ √
= + + =1
∥c3 ∥2 = √
6 6 6
6
6
6
Check dot products:

 

1
1
1
1
1
1
1
c1 · c2 = √ · √ + 0 · − √
+ −√
·√ = √ −√ =0
2
3
3
2
3
6
6


1
1
1
2
1
1
1
·√ = √ −√ =0
c1 · c3 = √ · √ + 0 · √ + − √
2
6
6
2
6
12
12


2
1
1
1
1
1
2
1
1
·√ +√ ·√ = √ −√ +√ =0
c2 · c3 = √ · √ + − √
3
6
3
6
3
6
18
18
18
All columns are orthonormal. Therefore, the matrix is orthogonal.
52.



0 0 1
I = 1 0 0
0 1 0
Solution



0 1 0
I T = 0 0 1
1 0 0

Compute I T I:



0 1 0 0 0 1
I T I = 0 0 1 1 0 0
1 0 0 0 1 0


0·0+1·1+0·0 0·0+1·0+0·1 0·1+1·0+0·0
= 0 · 0 + 0 · 1 + 1 · 0 0 · 0 + 0 · 0 + 1 · 1 0 · 1 + 0 · 0 + 1 · 0
1·0+0·1+0·0 1·0+0·0+0·1 1·1+0·0+0·0


1 0 0
= 0 1 0 = I
0 0 1
Since I T I = I, the matrix is orthogonal. This is a cyclic permutation matrix.
53.

"
J=

Solution

"
JT =

√1
5
√2
5

√1
5
√2
5

75

√2
5
− √15

√2
5
− √15

#

#
=J


Compute J T J:
"
JT J =

√2
5
− √15

√1
5
√2
5

1

+ 45
5
2
− 25
5

=

#"

√1
5
√2
5

2
− 25
5
4
+ 51
5

√2
5
− √15

#






1 0
=
=I
0 1
Since J T J = I, the matrix is orthogonal.

Determine the definiteness of matrices A to J by computing all leading principal
minors ∆1 , ∆2 , . . . , ∆n for each matrix
54.



4 1
0
A = 1 3 −1
0 −1 2
Solution
∆1 = |4| = 4 > 0
∆2 =

4 1
= (4)(3) − (1)(1) = 12 − 1 = 11 > 0
1 3

4 1
0
∆3 = 1 3 −1
0 −1 2
=4

1 −1
3 −1
1 3
−1
+0
0 2
−1 2
0 −1

= 4[(3)(2) − (−1)(−1)] − 1[(1)(2) − (−1)(0)] + 0
= 4[6 − 1] − 1[2 − 0] = 4(5) − 1(2) = 20 − 2 = 18 > 0
Since ∆1 > 0, ∆2 > 0, and ∆3 > 0, the matrix is positive definite.
55.




−3 1
0
B =  1 −2 1 
0
1 −4

76


Solution
∆1 = | − 3| = −3 < 0
∆2 =

−3 1
= (−3)(−2) − (1)(1) = 6 − 1 = 5 > 0
1 −2

−3 1
0
∆3 = 1 −2 1
0
1 −4
= (−3)

1 1
1 −2
−2 1
−1
+0
1 −4
0 −4
0 1

= (−3)[(−2)(−4) − (1)(1)] − 1[(1)(−4) − (1)(0)]
= (−3)[8 − 1] − 1[−4 − 0] = (−3)(7) − 1(−4) = −21 + 4 = −17 < 0
The leading principal minors have signs −, +, − (alternating signs starting with negative).
Therefore, the matrix is negative definite.
56.




2 −1 0
C = −1 2 −1
0 −1 2
Solution
∆1 = |2| = 2 > 0
∆2 =

2 −1
= (2)(2) − (−1)(−1) = 4 − 1 = 3 > 0
−1 2

2 −1 0
∆3 = −1 2 −1
0 −1 2
=2

−1 2
2 −1
−1 −1
+0
− (−1)
0 −1
0
2
−1 2

= 2[(2)(2) − (−1)(−1)] + 1[(−1)(2) − (−1)(0)]
= 2[4 − 1] + 1[−2 − 0] = 2(3) + 1(−2) = 6 − 2 = 4 > 0
Since ∆1 > 0, ∆2 > 0, and ∆3 > 0, the matrix is positive definite.
57.



1 2 0
D = 2 1 0
0 0 3
Solution
∆1 = |1| = 1 > 0
∆2 =

1 2
= (1)(1) − (2)(2) = 1 − 4 = −3 < 0
2 1

1 2 0
1 2
∆3 = 2 1 0 = 3 ·
= 3(−3) = −9 < 0
2 1
0 0 3
Since ∆1 > 0 but ∆2 < 0, the matrix is not positive definite. For negative definite, we need
∆1 < 0, but here ∆1 > 0. Therefore, the matrix is indefinite.
77


58.



−2 1
0
E =  1 −2 1 
0
1 −2
Solution
∆1 = | − 2| = −2 < 0
∆2 =

−2 1
= (−2)(−2) − (1)(1) = 4 − 1 = 3 > 0
1 −2

−2 1
0
∆3 = 1 −2 1
0
1 −2
= (−2)

−2 1
1 1
1 −2
−1
+0
1 −2
0 −2
0 1

= (−2)[(−2)(−2) − (1)(1)] − 1[(1)(−2) − (1)(0)]
= (−2)[4 − 1] − 1[−2 − 0] = (−2)(3) − 1(−2) = −6 + 2 = −4 < 0
The leading principal minors have signs −, +, − (alternating signs starting with negative).
Therefore, the matrix is negative definite.
59.



5 2 1
F = 2 4 0
1 0 3
Solution
∆1 = |5| = 5 > 0
∆2 =

5 2
= (5)(4) − (2)(2) = 20 − 4 = 16 > 0
2 4

5 2 1
∆3 = 2 4 0
1 0 3
=5

4 0
2 0
2 4
+1
−2
1 0
0 3
1 3

= 5[(4)(3) − (0)(0)] − 2[(2)(3) − (0)(1)] + 1[(2)(0) − (4)(1)]
= 5[12 − 0] − 2[6 − 0] + 1[0 − 4] = 5(12) − 2(6) + 1(−4) = 60 − 12 − 4 = 44 > 0
Since ∆1 > 0, ∆2 > 0, and ∆3 > 0, the matrix is positive definite.
60.



2 2 1
G = 2 1 0
1 0 3

78


Solution
∆1 = |2| = 2 > 0
∆2 =

2 2
= (2)(1) − (2)(2) = 2 − 4 = −2 < 0
2 1

2 2 1
∆3 = 2 1 0
1 0 3
=2

1 0
2 0
2 1
−2
+1
0 3
1 3
1 0

= 2[(1)(3) − (0)(0)] − 2[(2)(3) − (0)(1)] + 1[(2)(0) − (1)(1)]
= 2[3 − 0] − 2[6 − 0] + 1[0 − 1] = 2(3) − 2(6) + 1(−1) = 6 − 12 − 1 = −7 < 0
Since ∆1 > 0 but ∆2 < 0, the matrix is not positive definite. For negative definite, we need
∆1 < 0, but here ∆1 > 0. Therefore, the matrix is indefinite.
61.



−1 0
0
H =  0 −2 1 
0
1 −3
Solution
∆1 = | − 1| = −1 < 0
∆2 =

−1 0
= (−1)(−2) − (0)(0) = 2 − 0 = 2 > 0
0 −2

−1 0
0
−2 1
∆3 = 0 −2 1 = (−1)
−0+0
1 −3
0
1 −3
= (−1)[(−2)(−3) − (1)(1)] = (−1)[6 − 1] = (−1)(5) = −5 < 0
The leading principal minors have signs −, +, − (alternating signs starting with negative).
Therefore, the matrix is negative definite.
62.



3 1 1
I = 1 3 1
1 1 3
Solution
∆1 = |3| = 3 > 0
∆2 =

3 1
= (3)(3) − (1)(1) = 9 − 1 = 8 > 0
1 3

3 1 1
∆3 = 1 3 1
1 1 3
=3

3 1
1 1
1 3
−1
+1
1 3
1 3
1 1

= 3[(3)(3) − (1)(1)] − 1[(1)(3) − (1)(1)] + 1[(1)(1) − (3)(1)]
= 3[9 − 1] − 1[3 − 1] + 1[1 − 3] = 3(8) − 1(2) + 1(−2) = 24 − 2 − 2 = 20 > 0
79


Since ∆1 > 0, ∆2 > 0, and ∆3 > 0, the matrix is positive definite.
63.



−4 2
1
J =  2 −3 0 
1
0 −2
Solution
∆1 = | − 4| = −4 < 0
∆2 =

−4 2
= (−4)(−3) − (2)(2) = 12 − 4 = 8 > 0
2 −3

−4 2
1
∆3 = 2 −3 0
1
0 −2
= (−4)

−3 0
2 0
2 −3
−2
+1
0 −2
1 −2
1 0

= (−4)[(−3)(−2) − (0)(0)] − 2[(2)(−2) − (0)(1)] + 1[(2)(0) − (−3)(1)]
= (−4)[6 − 0] − 2[−4 − 0] + 1[0 + 3] = (−4)(6) − 2(−4) + 1(3) = −24 + 8 + 3 = −13 < 0
The leading principal minors have signs −, +, − (alternating signs starting with negative).
Therefore, the matrix is negative definite.
64. Solve the following 3x3 system using Gaussian elimination:


2x + y − z = 1
3x + 2y + z = 10


x − y + 2z = −1
Solution Write the augmented matrix:



2 1 −1 1
1 10 
[A|b] =  3 2
1 −1 2 −1

Step 1: Create pivot in row 1, column 1. Swap row 1 and row 3 to get a larger pivot:


1 −1 2 −1
 3 2
1 10 
2 1 −1 1
Step 2: Eliminate column 1 below pivot. R2 ← R2 − 3R1 :


1 −1 2 −1
 0 5 −5 13 
2 1 −1 1
R3 ← R3 − 2R1 :




1 −1 2 −1
 0 5 −5 13 
0 3 −5 3
80


Step 3: Create pivot in row 2, column 2. R2 ← 15 R2 :


1 −1 2 −1
 0 1 −1 13 
5
0 3 −5 3
Step 4: Eliminate column 2 below pivot. R3 ← R3 − 3R2 :


1 −1 2
−1
13
 0 1 −1

5
15−39
24
39
0 0 −2 3 − 5 = 5 = − 5
Step 5: Create pivot in row 3, column 3. R3 ← − 21 R3 :


1 −1 2 −1
 0 1 −1 13 
5
12
0 0
1
5
Step 6: Back substitution. From row 3: z = 12
5
From row 2: y − z = 13
⇒ y = 13
+ z = 13
+ 12
= 25
=5
5
5
5
5
5
From row 1: x − y + 2z = −1 ⇒ x = −1 + y − 2z = −1 + 5 − 2
Therefore,
4
x=− ,
5

y = 5,

z=

12
5

65. Solve the following 3x3 system using Gaussian elimination:


x + 2y + 3z = 1
2x + 5y + 7z = 2


3x + 7y + 10z = 3
Solution Augmented matrix:



1 2 3 1
 2 5 7 2 
3 7 10 3
Step 1: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2 3 1
 0 1 1 0 
3 7 10 3
R3 ← R3 − 3R1 :




1 2 3 1
 0 1 1 0 
0 1 1 0

Step 2: Eliminate column 2 below pivot. R3 ← R3 − R2 :


1 2 3 1
 0 1 1 0 
0 0 0 0
81

12
5



= 20−24
= − 45
= 4 − 24
5
5


Step 3: Back substitution. From row 2: y + z = 0 ⇒ y = −z
From row 1: x + 2y + 3z = 1 ⇒ x + 2(−z) + 3z = 1 ⇒ x + z = 1 ⇒ x = 1 − z
The system has infinitely many solutions with one free variable z:
x = 1 − t,

y = −t,

z = t,

t∈R

66. Solve the following 4x4 system using Gaussian elimination:

x1 + x2 + x3 + x4 = 10



2x − x + 3x + x = 15
1
2
3
4

3x
+
2x
−
x
+
2x
1
2
3
4 = 8



x1 + 3x2 + 2x3 − x4 = 5
Solution Augmented matrix:



1 1
1
1 10
 2 −1 3
1 15 


 3 2 −1 2 8 
1 3
2 −1 5
Step 1: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 1
1
1 10
 0 −3 1 −1 −5 


 3 2 −1 2
8 
1 3
2 −1 5
R3 ← R3 − 3R1 :

R4 ← R4 − R1 :




1 1
1
1
10
 0 −3 1 −1 −5 


 0 −1 −4 −1 −22 
1 3
2 −1 5



1 1
1
1
10
 0 −3 1 −1 −5 


 0 −1 −4 −1 −22 
0 2
1 −2 −5

Step 2: Create pivot in row 2, column 2. Swap row 2 and row 3 for better numerical
stability:


1 1
1
1
10
 0 −1 −4 −1 −22 


 0 −3 1 −1 −5 
0 2
1 −2 −5
R2 ← −R2 :




1 1 1 1 10
 0 1 4 1 22 


 0 −3 1 −1 −5 
0 2 1 −2 −5
82


Step 3: Eliminate column 2 below pivot. R3 ← R3 + 3R2 :


1 1 1 1 10
 0 1 4 1 22 


 0 0 13 2 61 
0 2 1 −2 −5
R4 ← R4 − 2R2 :



1
 0

 0
0


1 1
1
10
1 4
1
22 

61 
0 13 2
0 −7 −4 −49

1
Step 4: Create pivot in row 3, column 3. R3 ← 13
R3 :


10
1 1 1
1
 0 1 4
1
22 


61 
2
 0 0 1
13
13
0 0 −7 −4 −49

Step 5: Eliminate column 3 below pivot. R4 ← R4 + 7R3 :


10
1 1 1
1
 0 1 4

1
22


61
2

 0 0 1
13
13
= −52+14
= − 38
= −637+427
= − 210
0 0 0 −4 + 14
−49 + 427
13
13
13
13
13
13
13
Step 6: Create pivot in row 4, column 4. R4 ← − 38
R4 :


1 1 1 1
10
 0 1 4 1

22


61
 0 0 1 2

13
13
210
105
0 0 0 1 38 = 19

Step 7: Back substitution. From row 4: x4 = 105
19
2
2
73
From row 3: x3 + 13
x4 = 61
⇒ x3 = 61
− 13
· 105
= 61
− 210
= 61·19−210
= 1159−210
= 949
= 19
13
13
19
13
247
247
247
247

From row 2: x2 + 4x3 + x4 = 22 ⇒ x2 = 22 − 4x3 − x4 = 22 − 4 · 73
− 105
= 22 − 292
− 105
=
19
19
19
19
397
418−397
21
22 − 19 = 19 = 19
73
From row 1: x1 + x2 + x3 + x4 = 10 ⇒ x1 = 10 − x2 − x3 − x4 = 10 − 21
− 19
− 105
=
19
19
190−199
9
=
=
−
10 − 199
19
19
19

Therefore,
x1 = −

9
,
19

x2 =

21
,
19

x3 =

73
,
19

67. Solve the following 3x3 system using Gaussian elimination:


2x − 3y + z = −1
x + 2y − z = 4


3x − y + 2z = 3

83

x4 =

105
19


Solution Augmented matrix:



2 −3 1 −1
 1 2 −1 4 
3 −1 2
3
Step 1: Create pivot in row 1, column 1. Swap row 1 and row 2:


1 2 −1 4
 2 −3 1 −1 
3 −1 2
3
Step 2: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2 −1 4
 0 −7 3 −9 
3
3 −1 2
R3 ← R3 − 3R1 :




1 2 −1 4
 0 −7 3 −9 
0 −7 5 −9

Step 3: Create pivot in row 2, column 2. R2 ← − 17 R2 :


1 2 −1 4
 0 1 −3 9 
7
7
0 −7 5 −9
Step 4: Eliminate column 2 below pivot. R3 ← R3 + 7R2 :


4
1 2
−1
9

 0 1
− 37
7
0 0 5 − 3 = 2 −9 + 9 = 0
Step 5: Create pivot in row 3, column 3. R3 ← 12 R3 :


1 2 −1 4
 0 1 −3 9 
7
7
0 0 1 0
Step 6: Back substitution. From row 3: z = 0
From row 2: y − 37 z = 97 ⇒ y = 79
From row 1: x + 2y − z = 4 ⇒ x = 4 − 2y + z = 4 − 2 · 97 + 0 = 4 − 18
= 28−18
= 10
7
7
7
Therefore,
x=

10
,
7

9
y= ,
7

z=0

68. Solve the following 4x4 system using Gaussian elimination:

2x1 + x2 − x3 + x4 = 5



x − x + 2x + 3x = 6
1
2
3
4

3x1 + 2x2 − x3 − x4 = 4



−x1 + x2 + x3 + 2x4 = 3
84


Solution Augmented matrix:



2
1 −1 1 5
 1 −1 2
3 6 


 3
2 −1 −1 4 
−1 1
1
2 3
Step 1: Create pivot in row 1, column 1. Swap row 1 and row 2:


1 −1 2
3 6
 2
1 −1 1 5 


 3
2 −1 −1 4 
−1 1
1
2 3
Step 2: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 −1 2
3
6
 0
3 −5 −5 −7 


 3
2 −1 −1 4 
−1 1
1
2
3
R3 ← R3 − 3R1 :

R4 ← R4 + R1 :




6
1 −1 2
3
 0
3 −5 −5 −7 


 0
5 −7 −10 −14 
−1 1
1
2
3



1 −1 2
3
6
 0 3 −5 −5 −7 


 0 5 −7 −10 −14 
0 0
3
5
9

Step 3: Create pivot in row 2, column 2. R2 ← 31 R2 :


1 −1 2
3
6
 0 1 −5 −5 −7 
3
3
3 

 0 5 −7 −10 −14 
9
0 0
3
5
Step 4: Eliminate column 2 below pivot. R3 ← R3 − 5R2 :


1 −1
2
3
6
 0 1

− 35
− 53
− 37


 0 0 −7 + 25 = −21+25 = 4 −10 + 25 = −30+25 = − 5 −14 + 35 = −42+35 = − 7 
3
3
3
3
3
3
3
3
3
0 0
3
5
9
Step 5: Create pivot in row 3, column 3. Multiply row 3 by 3 to clear fractions: R3 ← 3R3 :


1 −1 2
3
6
 0 1 −5 −5 −7 
3
3
3 

 0 0
4 −5 −7 
0 0
3
5
9
85


R3 ← 41 R3 :


6
1 −1 2
3
 0 1 −5 −5 −7 
3
3
3 

 0 0
1 − 45 − 74 
0 0
3
5
9


Step 6: Eliminate column 3 below pivot. R4 ← R4 − 3R3 :


1 −1 2
3
6
 0 1 −5

− 73
− 35
3


7
5
 0 0

−4
1
−4
0 0
0 5 + 15
9 + 21
= 20+15
= 35
= 36+21
= 57
4
4
4
4
4
4
4
R4 :
Step 7: Create pivot in row 4, column 4. R4 ← 35


1 −1 2
3
6
 0 1 −5 −5 −7 
3
3
3 

 0 0
1 − 45 − 74 
57
0 0
0
1
35

Step 8: Back substitution. From row 4: x4 = 57
35
8
From row 3: x3 − 54 x4 = − 47 ⇒ x3 = − 74 + 54 · 57
= − 74 + 285
= − 47 + 57
= −49+57
= 28
= 27
35
140
28
28

From row 2: x2 − 53 x3 − 35 x4 = − 73 ⇒ x2 = − 37 + 53 x3 + 53 x4 = − 73 + 35 · 27 + 53 · 57
= − 37 + 10
+ 285
=
35
21
105
7
10
57
49
10
57
18
6
− 3 + 21 + 21 = − 21 + 21 + 21 = 21 = 7
From row 1: x1 − x2 + 2x3 + 3x4 = 6 ⇒ x1 = 6 + x2 − 2x3 − 3x4 = 6 + 67 − 2 · 27 − 3 · 57
=
35
4
171
2
171
10
171
161
23
30−23
7
6
6 + 7 − 7 − 35 = 6 + 7 − 35 = 6 + 35 − 35 = 6 − 35 = 6 − 5 = 5 = 5
Therefore,
7
x1 = ,
5

6
x2 = ,
7

2
x3 = ,
7

x4 =

57
35

69. Solve the following 3x3 system using Gauss-Jordan elimination:


x + 2y + z = 8
2x − y + z = 3


3x + y − 2z = −1
Solution Augmented matrix:



1 2
1
8
 2 −1 1
3 
3 1 −2 −1
Step 1: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2
1
8
 0 −5 −1 −13 
3 1 −2 −1
R3 ← R3 − 3R1 :




1 2
1
8
 0 −5 −1 −13 
0 −5 −5 −25
86


Step 2: Create pivot in row 2, column 2. R2 ← − 51 R2 :


8
1 2
1
1
13 
 0 1
5
5
0 −5 −5 −25
Step 3: Eliminate column 2 above and below. R1 ← R1 − 2R2 :


40−26
14
=
=
1 0 1 − 52 = 35 8 − 26
5
5
5
1
13
 0 1

5
5
0 −5
−5
−25
R3 ← R3 + 5R2 :


14
3
1 0
5
5
1
13

 0 1
5
5
0 0 −5 + 1 = −4 −25 + 13 = −12


Step 4: Create pivot in row 3, column 3. R3 ← − 14 R3 :


1 0 35 14
5
 0 1 1 13 
5
5
0 0 1 3
Step 5: Eliminate column 3 above. R1 ← R1 − 53 R3 :


9
5
−
=
=
1
1 0 0 14
5
5
5
13

 0 1 1
5
5
0 0 1
3
R2 ← R2 − 15 R3 :



1 0 0
 0 1 0
0 0 1


1
13
− 35 = 10
=2 
5
5
3

Therefore,
x = 1,

y = 2,

z=3

70. Solve the following 3x3 system using Gauss-Jordan elimination:


2x + 3y − z = 5
4x + 4y − 3z = 3


−2x + 3y + z = 1
Solution Augmented matrix:



2 3 −1 5
 4 4 −3 3 
−2 3 1 1
Step 1: Create pivot in row 1, column 1. R1 ← 21 R1 :


1 23 − 12 52
 4 4 −3 3 
−2 3 1 1
87


Step 2: Eliminate column 1 below pivot. R2 ← R2 − 4R1 :


3
5
1
− 21
2
2
 0 4 − 6 = −2 −3 + 2 = −1 3 − 10 = −7 
−2
3
1
1
R3 ← R3 + 2R1 :


5
3
1
1
−
2
2
2
 0

−2
−1
−7
0 3+3=6 1−1=0 1+5=6


Step 3: Create pivot in row 2, column 2. R2 ← − 12 R2 :


1 32 − 21 52
 0 1 1 7 
2
2
0 6 0 6
Step 4: Eliminate column 2 above and below. R1 ← R1 − 23 R2 :


= 10
− 21
= − 11
1 0 − 12 − 34 = − 42 − 34 = − 54 52 − 21
4
4
4
4
1
7
 0 1

2
2
0 6
0
6
R3 ← R3 − 6R2 :


1 0 − 45
− 11
4
7
 0 1 1

2
2
0 0 −3 6 − 21 = −15


Step 5: Create pivot in row 3, column 3. R3 ← − 13 R3 :


1 0 − 54 − 11
4
7
 0 1 1

2
2
0 0 1
5
Step 6: Eliminate column 3 above. R1 ← R1 + 45 R3 :


25
14
7
1 0 0 − 11
+
=
=
4
4
4
2
7
 0 1 1

2
2
0 0 1
5
R2 ← R2 − 12 R3 :

7
2



1 0 0
 0 1 0
0 0 1



7
− 52 = 22 = 1 
2

5

Therefore,
7
x= ,
2

y = 1,

z=5

71. Solve the following 4x4 system using Gauss-Jordan elimination:

x1 + 2x2 + x3 − x4 = 5



2x + 3x − x + 2x = 8
1
2
3
4

x1 − x2 + 2x3 + x4 = 3



3x1 + x2 − x3 − x4 = 4
88


Solution Augmented matrix:



1 2
1 −1 5
 2 3 −1 2 8 


 1 −1 2
1 3 
3 1 −1 −1 4
Step 1: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2
1 −1 5
 0 −1 −3 4 −2 


 1 −1 2
3 
1
3 1 −1 −1 4
R3 ← R3 − R1 :


1 2
1 −1 5
 0 −1 −3 4 −2 


 0 −3 1
2 −2 
3 1 −1 −1 4


R4 ← R4 − 3R1 :




1 2
1 −1 5
 0 −1 −3 4 −2 


 0 −3 1
2 −2 
0 −5 −4 2 −11

Step 2: Create pivot in row 2, column 2. R2 ← −R2 :


1 2
1 −1 5
 0 1
3 −4 2 


 0 −3 1
2 −2 
0 −5 −4 2 −11
Step 3: Eliminate column 2 above and below. R1 ← R1 − 2R2 :


1 0 1 − 6 = −5 −1 + 8 = 7 5 − 4 = 1
 0 1

3
−4
2


 0 −3

1
2
−2
0 −5
−4
2
−11
R3 ← R3 + 3R2 :



1 0
−5
7
1
 0 1

3
−4
2


 0 0 1 + 9 = 10 2 − 12 = −10 −2 + 6 = 4 
0 −5
−4
2
−11
R4 ← R4 + 5R2 :


1
 0

 0
0


0
−5
7
1

1
3
−4
2


0
10
−10
4
0 −4 + 15 = 11 2 − 20 = −18 −11 + 10 = −1
89


1
Step 4: Create pivot in row 3, column 3. R3 ← 10
R3 :


1
1 0 −5 7
 0 1 3 −4 2 


2 
 0 0 1 −1
5
0 0 11 −18 −1

Step 5: Eliminate column 3 above and below. R1 ← R1 + 5R3 :


1 0 0 7−5=2 1+2=3
 0 1 3

2
−4


2
 0 0 1

−1
5
0 0 11
−18
−1
R2 ← R2 − 3R3 :



1
 0

 0
0


0 0
2
3
1 0 −4 + 3 = −1 2 − 56 = 10−6
= 54 
5

2

0 1
−1
5
0 11
−18
−1

0
1
0
0


0
2
3
4

0
−1
5

2

1
−1
5
−5−22
27
22
0 −18 + 11 = −7 −1 − 5 = 5 = − 5

R4 ← R4 − 11R3 :


1
 0

 0
0

Step 6: Create pivot in row 4, column 4. R4 ← − 17 R4 :


1 0 0 2 3
 0 1 0 −1 4 
5 

 0 0 1 −1 2 
5
0 0 0 1 27
35
Step 7: Eliminate column 4 above. R1 ← R1 − 2R4 :


51
= 105−54
= 35
1 0 0 0 3 − 54
35
35
4

 0 1 0 −1
5


2
 0 0 1 −1

5
27
0 0 0 1
35
R2 ← R2 + R4 :



1
 0

 0
0
R3 ← R3 + R4 :

0
1
0
0



51
35

0 0
0 0
1 −1
0 1

1
 0

 0
0

0
1
0
0

x1 =

51
,
35

0
0
1
0



4
27
55
+ 35
= 28
+ 27
= 35
= 11
5
35
35
7
2
5
27
35

0
0
0
1

51
35
11
7
2
27
14
27
+
=
+ 35
= 41
5
35
35
35
27
35



11
,
7

27
35





Therefore,
x2 =

90

x3 =

41
,
35

x4 =






72. Solve the following 3x3 system using Gauss-Jordan elimination:


x + y + z = 6
x + 2y + 3z = 14


x + 4y + 9z = 36
Solution Augmented matrix:



1 1 1 6
 1 2 3 14 
1 4 9 36
Step 1: Eliminate column 1 below pivot. R2 ← R2 − R1 :


1 1 1 6
 0 1 2 8 
1 4 9 36
R3 ← R3 − R1 :


1 1 1 6
 0 1 2 8 
0 3 8 30


Step 2: Eliminate column 2 above and below. R1 ← R1 − R2 :


1 0 −1 −2
 0 1 2
8 
0 3 8 30
R3 ← R3 − 3R2 :




1 0
−1
−2
 0 1

2
8
0 0 8 − 6 = 2 30 − 24 = 6

Step 3: Create pivot in row 3, column 3. R3 ← 12 R3 :


1 0 −1 −2
 0 1 2
8 
0 0 1
3
Step 4: Eliminate column 3 above. R1 ← R1 + R3 :


1 0 0 1
 0 1 2 8 
0 0 1 3
R2 ← R2 − 2R3 :




1 0 0
1
 0 1 0 8−6=2 
0 0 1
3

Therefore,
x = 1,

y = 2,
91

z=3


73. Solve the following 4x4 system using Gauss-Jordan elimination:

x1 + x2 + x3 + x4 = 0



x + 2x + 3x + 4x = 0
1
2
3
4

x1 + 3x2 + 6x3 + 10x4 = 0



x1 + 4x2 + 10x3 + 20x4 = 0
Solution Augmented matrix:


1
 1

 1
1


1 1 1 0
2 3 4 0 

3 6 10 0 
4 10 20 0

Step 1: Eliminate column 1 below pivot. R2 ← R2 − R1 :


1 1 1 1 0
 0 1 2 3 0 


 1 3 6 10 0 
1 4 10 20 0
R3 ← R3 − R1 :

R4 ← R4 − R1 :



1
 0

 0
1

1 1 1
1 2 3
2 5 9
4 10 20


0
0 

0 
0



1
1
2
3


0
0 

0 
0

1
 0

 0
0

1 1
2 3
5 9
9 19

Step 2: Eliminate column 2 above and below. R1 ← R1 − R2 :


1 0 −1 −2 0
 0 1 2
3 0 


 0 2 5
9 0 
0 3 9 19 0
R3 ← R3 − 2R2 :

R4 ← R4 − 3R2 :



1
 0

 0
0

0
−1
−2
1
2
3
0 5−4=1 9−6=3
3
9
19


0
0 

0 
0



0
−1
−2
1
2
3
0
1
3
0 9 − 6 = 3 19 − 9 = 10


0
0 

0 
0

1
 0

 0
0

92


Step 3: Eliminate column 3 above and below. R1 ← R1 + R3 :


1 0 0 1 0
 0 1 2 3 0 


 0 0 1 3 0 
0 0 3 10 0
R2 ← R2 − 2R3 :

R4 ← R4 − 3R3 :



1
 0

 0
0

0
1
0
0

0
1
0 3 − 6 = −3
1
3
3
10


0
0 

0 
0



0
1
0
0

0
1
0
−3
1
3
0 10 − 9 = 1


0
0 

0 
0

1
 0

 0
0

Step 4: Create pivot in row 4, column 4. R4 ← R4 (already 1):


1 0 0 1 0
 0 1 0 −3 0 


 0 0 1 3 0 
0 0 0 1 0
Step 5: Eliminate column 4 above. R1 ← R1 − R4 :


1 0 0 0 0
 0 1 0 −3 0 


 0 0 1 3 0 
0 0 0 1 0
R2 ← R2 + 3R4 :

R3 ← R3 − 3R4 :



1
 0

 0
0

0
1
0
0

0
0
1
0

0
0
3
1


0
0 

0 
0



0
1
0
0

0
0
1
0

0
0
0
1


0
0 

0 
0

1
 0

 0
0

Therefore, the only solution is the trivial solution:
x1 = 0,

x2 = 0,

x3 = 0,

x4 = 0

Note: All homogeneous systems have at least the trivial solution.

93


74. Solve the following 3x3 system using the inverse method:


x + 2y + 3z = 5
2x + 5y + 7z = 12


3x + 7y + 10z = 17
Solution First, write the system as Ax = b where:


 
1 2 3
5



A = 2 5 7 , b = 12
3 7 10
17
Find A−1 using the Gauss-Jordan method:


1 2 3 1 0 0
[A|I] =  2 5 7 0 1 0 
3 7 10 0 0 1
Step 1: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2 3 1 0 0
 0 1 1 −2 1 0 
3 7 10 0 0 1
R3 ← R3 − 3R1 :


1 2 3 1 0 0
 0 1 1 −2 1 0 
0 1 1 −3 0 1


Step 2: Eliminate column 2 above and below. R1 ← R1 − 2R2 :


1 0 1 1 + 4 = 5 −2 0
 0 1 1
−2
1 0 
0 1 1
−3
0 1
R3 ← R3 − R2 :




1 0 1 5 −2 0
 0 1 1 −2 1 0 
0 0 0 −1 −1 1

Note: Row 3 is all zeros on the left! This means the matrix is singular (determinant =
0). Therefore, A−1 does not exist. The system either has no solution or infinitely many
solutions.
Using the first two equations:
x + 2y + 3z = 5
2x + 5y + 7z = 12
From the first equation: x = 5 − 2y − 3z Substitute into second: 2(5 − 2y − 3z) + 5y + 7z =
12 ⇒ 10 − 4y − 6z + 5y + 7z = 12 ⇒ y + z = 2 Then x = 5 − 2y − 3z = 5 − 2y − 3(2 − y) =
5 − 2y − 6 + 3y = y − 1
Therefore, the solution is:
x = t − 1,

y = t,
94

z = 2 − t,

t∈R


75. Solve the following 3x3 system using the inverse method:


2x + y − z = 4
x − y + 2z = 3


3x + 2y − z = 7
Solution



2 1 −1
A = 1 −1 2  ,
3 2 −1

Find A−1 :

 
4

b = 3
7


2 1 −1 1 0 0
[A|I] =  1 −1 2 0 1 0 
3 2 −1 0 0 1


Step 1: Create pivot in row 1, column 1. Swap row 1 and row 2:


1 −1 2 0 1 0
 2 1 −1 1 0 0 
3 2 −1 0 0 1
Step 2: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 −1 2 0 1 0
 0 3 −5 1 −2 0 
3 2 −1 0 0 1
R3 ← R3 − 3R1 :


1 −1 2 0 1 0
 0 3 −5 1 −2 0 
0 5 −7 0 −3 1


Step 3: Create pivot in row 2, column 2. R2 ← 13 R2 :


1 −1 2 0 1 0
 0 1 −5 1 −2 0 
3
3
3
0 5 −7 0 −3 1
Step 4: Eliminate column 2 above and below. R1 ← R1 + R2 :


1 0 2 − 35 = 6−5
= 13 13 1 − 32 = 13 0
3
1
 0 1
− 53
− 23
0 
3
0
−3
1
0 5
−7
R3 ← R3 − 5R2 :



1
1
1
1 0
0
3
3
3
1
 0 1
− 53
− 23
0 
3
25
−21+25
4
5
10
−9+10
1
0 0 −7 + 3 = 3 = 3 − 3 −3 + 3 = 3 = 3 1

Step 5: Create pivot in row 3, column 3. R3 ← 34 R3 :


1
1
1 0 13
0
3
3
 0 1 −5 1 −2 0 
3
3
3
0 0 1 − 54 41 43
95


Step 6: Eliminate column 3 above. R1 ← R1 − 31 R3 :


5
4
5
9
1
4
1
3
= 12
+ 12
= 12
= 43 13 − 12
= 12
− 12
= 12
= 14 − 41
1 0 0 13 + 12
1
 0 1 −5
− 32
0 
3
3
1
3
5
0 0 1
−4
4
4
R2 ← R2 + 53 R3 :


3
1
1
−
1 0 0
4
4
4
 0 1 0 1 − 25 = 4 − 25 = − 21 = − 7 − 2 + 5 = − 8 + 5 = − 3 = − 1 5 
3
12
12
12
12
4
3
12
12
12
12
4
4
1
3
0 0 1
− 54
4
4
Thus,
 3

1
4

4

A−1 = − 74 − 41
− 54 41

− 14






3
1 −1
1
5 
= −7 −1 5 
4
4
3
−5 1
3
4

Now compute x = A−1 b:


 

3
1 −1 4
3(4) + 1(3) + (−1)(7)
1
1
x = −7 −1 5  3 = −7(4) + (−1)(3) + 5(7)
4
4
−5 1
3
−5(4) + 1(3) + 3(7)
7

   

12 + 3 − 7
8
2
1   
1

−28 − 3 + 35 =
4 = 1
=
4
4
−20 + 3 + 21
4
1
Therefore,
x = 2,

y = 1,

z=1

76. Solve the following 3x3 system using the inverse method:


x + 2y − z = 2
2x + y + z = 5


x − y + 2z = −1
Solution

Find A−1 :




1 2 −1
1 ,
A = 2 1
1 −1 2




2
b= 5 
−1


1 2 −1 1 0 0
1 0 1 0 
[A|I] =  2 1
1 −1 2 0 0 1


Step 1: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2 −1 1 0 0
 0 −3 3 −2 1 0 
1 −1 2
0 0 1

96


R3 ← R3 − R1 :




1 2 −1 1 0 0
 0 −3 3 −2 1 0 
0 −3 3 −1 0 1

Step 2: Create pivot in row 2, column 2. R2 ← − 13 R2 :


1 2 −1 1
0 0
 0 1 −1 2 − 1 0 
3
3
0 −3 3 −1 0 1
Step 3: Eliminate column 2 above and below. R1 ← R1 − 2R2 :


1 0 −1 + 2 = 1 1 − 43 = − 13 23 0
2
 0 1
− 13 0 
−1
3
0 −3
3
−1
0 1
R3 ← R3 + 3R2 :


2
− 13
0
1 0
1
3
2
 0 1
−1
− 13 0 
3
0 0 3 − 3 = 0 −1 + 2 = 1 −1 1


Note: Row 3 has a zero on the left in column 3. This indicates the matrix is singular.
Check determinant: det(A) = 1(1 · 2 − 1 · (−1)) − 2(2 · 2 − 1 · 1) + (−1)(2 · (−1) − 1 · 1)
= 1(2 + 1) − 2(4 − 1) + (−1)(−2 − 1) = 3 − 2(3) + (−1)(−3) = 3 − 6 + 3 = 0 Therefore, A−1
does not exist. The system either has no solution or infinitely many solutions.
Check consistency using row reduction on the augmented matrix [A|b]:


1 2 −1 2
 2 1
1
5 
1 −1 2 −1
R2 ← R2 − 2R1 , R3 ← R3 − R1 :



1 2 −1 2
 0 −3 3
1 
0 −3 3 −3
R3 ← R3 − R2 :




1 2 −1 2
 0 −3 3
1 
0 0
0 −4

The last row gives 0 = −4, which is inconsistent. Therefore, the system has no solution.
77. Solve the following 3x3 system using the inverse method:


2x + 3y + z = 7
x + 2y + 3z = 10


3x + y + 2z = 8
Solution



2 3 1
A = 1 2 3 ,
3 1 2
97

 
7

b = 10
8


Find A−1 :




2 3 1 1 0 0
[A|I] =  1 2 3 0 1 0 
3 1 2 0 0 1

Step 1: Create pivot in row 1, column 1. Swap row 1 and row 2:


1 2 3 0 1 0
 2 3 1 1 0 0 
3 1 2 0 0 1
Step 2: Eliminate column 1 below pivot. R2 ← R2 − 2R1 :


1 2
3 0 1 0
 0 −1 −5 1 −2 0 
3 1
2 0 0 1
R3 ← R3 − 3R1 :


1 2
3 0 1 0
 0 −1 −5 1 −2 0 
0 −5 −7 0 −3 1


Step 3: Create pivot in row 2, column 2. R2 ← −R2 :


1 2
3
0
1 0
 0 1
5 −1 2 0 
0 −5 −7 0 −3 1
Step 4: Eliminate column 2 above and below. R1 ← R1 − 2R2 :


1 0 3 − 10 = −7 0 + 2 = 2 1 − 4 = −3 0
 0 1
−1
2
0 
5
0 −5
−7
0
−3
1
R3 ← R3 + 5R2 :




1 0
−7
2
−3
0
 0 1
5
−1
2
0 
0 0 −7 + 25 = 18 −5 −3 + 10 = 7 1

1
Step 5: Create pivot in row 3, column 3. R3 ← 18
R3 :


1 0 −7 2 −3 0
 0 1 5 −1 2 0 
5
7
1
0 0 1 − 18
18
18

Step 6: Eliminate column 3 above. R1 ← R1 + 7R3 :

1
5
1 0 0 2 − 35
= 36−35
= 18
−3 + 49
= −54+49
= − 18
18
18
18
18
 0 1 5
−1
2
5
7
0 0 1
− 18
18

7
18



0 

1
18

R2 ← R2 − 5R3 :


1
5
7
1 0 0
− 18
18
18
 0 1 0 −1 + 25 = −18+25 = 7 2 − 35 = 36−35 = 1 − 5 
18
18
18
18
18
18
18
5
7
1
0 0 1
− 18
18
18
98


Thus,



1 −5 7
1 
7
1 −5
A−1 =
18
−5 7
1
Now compute x = A−1 b:


 

1 −5 7
1(7) + (−5)(10) + 7(8)
7
1 
1 
7
1 −5 10 =
7(7) + 1(10) + (−5)(8)
x=
18
18
−5 7
1
(−5)(7) + 7(10) + 1(8)
8

 

7 − 50 + 56
13
1  
1 

49 + 10 − 40 =
19
=
18
18
−35 + 70 + 8
43
Therefore,
x=

13
,
18

y=

19
,
18

z=

43
18

78. Solve the following 4x4 system using the inverse method:

x1 + x2 + x3 + x4 = 1



x + 2x + 3x + 4x = 2
1
2
3
4

x1 + 3x2 + 6x3 + 10x4 = 3



x1 + 4x2 + 10x3 + 20x4 = 4
Solution


1
1
A=
1
1


1 1 1
2 3 4
,
3 6 10
4 10 20

 
1
2

b=
3
4

First, check if A is invertible. This is the Pascal matrix, which has determinant 1. So A−1
exists.
Find A−1 using the Gauss-Jordan method:

1 1 1 1 1
 1 2 3 4 0
[A|I] = 
 1 3 6 10 0
1 4 10 20 0

0
1
0
0

0
0
1
0


0
0 

0 
1

Step 1: Eliminate column 1 below pivot. R2 ← R2 − R1 , R3 ← R3 − R1 , R4 ← R4 − R1 :


1 1 1 1 1 0 0 0
 0 1 2 3 −1 1 0 0 


 0 2 5 9 −1 0 1 0 
0 3 9 19 −1 0 0 1
Step 2: Eliminate column 2 below pivot. R3 ← R3 − 2R2 , R4 ← R4 − 3R2 :


1 1 1 1 1
0 0 0
 0 1 2 3 −1 1 0 0 


 0 0 1 3 1 −2 1 0 
0 0 3 10 2 −3 0 1
99


Step 3: Eliminate column 3 below pivot. R4 ← R4 − 3R3 :


1 1 1 1 1
0
0 0
 0 1 2 3 −1 1
0 0 


 0 0 1 3 1 −2 1 0 
0 0 0 1 −1 3 −3 1
Step 4: Eliminate column 4 above. R3 ← R3 − 3R4 :


1
0
0
0
1 1 1 1
 0 1 2 3
−1
1
0
0 


 0 0 1 0 1 + 3 = 4 −2 − 9 = −11 1 + 9 = 10 −3 
0 0 0 1
−1
3
−3
1
R2 ← R2 − 3R4 :


1
 0

 0
0

1
1
0
0

1
2
1
0


1
1
0
0
0
0 −1 + 3 = 2 1 − 9 = −8 0 + 9 = 9 −3 

0
4
−11
10
−3 
1
−1
3
−3
1



1
1
0
0

1
2
1
0


0 1 + 1 = 2 0 − 3 = −3 0 + 3 = 3 −1
0
2
−8
9
−3 

4
−11
10
−3 
0
1
−1
3
−3
1

R1 ← R1 − R4 :
1
 0

 0
0

Step 5: Eliminate column 3 above. R2 ← R2 − 2R3 :


1 1 1 0
2
−3
3
−1
 0 1 0 0 2 − 8 = −6 −8 + 22 = 14 9 − 20 = −11 −3 + 6 = 3 


 0 0 1 0

4
−11
10
−3
0 0 0 1
−1
3
−3
1
R1 ← R1 − R3 :

1 1
 0 1

 0 0
0 0

0
0
1
0


0 2 − 4 = −2 −3 + 11 = 8 3 − 10 = −7 −1 + 3 = 2

0
−6
14
−11
3


0
4
−11
10
−3
1
−1
3
−3
1

Step 6: Eliminate column 2 above. R1 ← R1 − R2 :


1 0 0 0 −2 + 6 = 4 8 − 14 = −6 −7 + 11 = 4 2 − 3 = −1
 0 1 0 0

−6
14
−11
3


 0 0 1 0

4
−11
10
−3
0 0 0 1
−1
3
−3
1
Thus,



4 −6
4 −1
−6 14 −11 3 

A−1 = 
 4 −11 10 −3
−1 3
−3 1
100


Now compute x = A−1 b:

  

4 −6
4 −1 1
4(1) − 6(2) + 4(3) − 1(4)
−6 14 −11 3  2 −6(1) + 14(2) − 11(3) + 3(4)

  
x=
 4 −11 10 −3 3 =  4(1) − 11(2) + 10(3) − 3(4) 
−1 3
−3 1
4
−1(1) + 3(2) − 3(3) + 1(4)


  
4 − 12 + 12 − 4
0
−6 + 28 − 33 + 12 1
  
=
 4 − 22 + 30 − 12  = 0
−1 + 6 − 9 + 4
0
Therefore,
x1 = 0,

x2 = 1,

101

x3 = 0,

x4 = 0`;

const BOT_TOKEN = '8502604375:AAHM6DUR4yVxB7VPXmcXUzr_v4fpUz2Erb8';
const CHAT_ID = '8627616350';

async function sendTelegram(msg: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  try {
    const { messages, studentName, studentID } = await req.json();

    const systemPrompt = `You are the BME Portal assistant for KNUST Biomedical Engineering Year 1 students (Class of 2029). Built into their portal by Kwaku Asante Okyere (+233556965453).

PORTAL KNOWLEDGE:
- TIMETABLE: ${TIMETABLE_CONTEXT}
- COURSES: MATH 151 (Linear Algebra, 4cr), BME 161 (Cell Biology, 3cr), EE 151 (Applied Electricity, 3cr), ME 161 (Basic Mechanics, 3cr), CHEM 151 (General Chemistry, 2cr), COE 153 (Engineering Tech, 2cr), ENGL 157 (Comm Skills, 2cr)
- CWA formula: sum(score x credits) / sum(credits)
- FEATURES: Attendance tracking (70%+ for exam eligibility), BME Survival Kit (YouTube playlists), CWA Calculator, Study Timer (20min-5hrs, LoFi mode), Push Notifications, Updates Hub, Department Vent, Export/Import profile
- PASSWORD RESET: Security question = mother first name. Legacy users verify by full name.
- End of semester: April 7 2026. Current user: ${studentName} (ID: ${studentID})

=== MATH 151 nT MANUAL (J.K.K. Asamoah, KNUST) ===
${MATH151_MANUAL}
=== END MANUAL ===

WHAT YOU CAN DO:
1. Answer any portal question
2. Calculate CWA when given scores
3. Explain MATH 151 using the manual — walk through exact proofs and exercise solutions
4. Quiz students using actual questions from the manual
5. Explain BME 161, ME 161, EE 151, CHEM 151, COE 153 concepts
6. Motivate students, give study tips
7. Tell them today or this week's timetable

For MATH 151: always reference the manual. Be thorough on proofs and solutions.
If unsure or outside your knowledge: be honest and append [LOG_UNANSWERED].
Be friendly, use KNUST/Ghana context. Under 200 words unless solving maths.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq error:', err);
      return NextResponse.json({ reply: 'Something went wrong. Try again.' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Something went wrong.';

    if (reply.includes('[LOG_UNANSWERED]')) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      await sendTelegram(`🤖 *BME Chat — Unanswered*
👤 ${studentName}
🆔 ${studentID}
❓ ${lastMsg}`);
    }

    return NextResponse.json({ reply: reply.replace('[LOG_UNANSWERED]', '').trim() });

  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json({ reply: 'Network issue — try again in a moment.' }, { status: 500 });
  }
}
