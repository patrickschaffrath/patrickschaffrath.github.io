---
layout: paper
title: Efficient structural combination
revision: 1
---

Problems that support *efficient structural combination* can be solved in polynomial time by combining solutions for $$k$$-elementary sets of input combinations derived from any $$n$$-elementary input to the problem. For each supporting problem there is a static and small $$k$$ that governs the size and amount of input combinations.

For example we assume a problem with input $$\{a,b,c,d\}$$ and $$k=3$$. All sets of input combinations would be $$\{a,b,c\}$$, $$\{a,b,d\}$$, $$\{a,c,d\}$$ and $$\{b,c,d\}$$. If we can combine the solutions to the four sets into a solution to the original and larger input in polynomial time, our example problem would support *efficient structural combination*.

We let $$k \in \mathbb{N}, k > 0$$ and $$n \in \mathbb{N}, n \ge k$$, which gives an upper limit of $${n\choose k} = \frac{n!}{k!(n-k)!} \le n^k$$ combinations for any $$n$$-elementary input.

For a problem to support *efficient structural combination*, we might have to convert inputs into a normalized form which does not change the outcome of problem instances, but is important to make every input compatible. Of course this normalization step is not allowed to take more than polynomial time.

## Relation to computational complexity classes

### Relation to *P-complete*

We assume a decision problem $$P_A$$ supporting *efficient structural combination*. If $$P_A$$ is a member of *P-complete*, it should follow that all members of *P-complete* support it.
In the end, every member of *P-complete* is a representative of one single abstract decision problem, that supports *efficient structural combination*.

#### $$P_A$$ can be Monotone Circuit Value Problem

MCVP supports *efficient structural combination* for $$k = 1$$, using only gates of exactly two inputs and exactly one output. For every of the two possible gates of MCVP we have equations with the following solutions:

1. $$x \land y = z$$ with solutions $$0 \land 0 = 0$$ or $$0 \land 1 = 0$$ or $$1 \land 0 = 0$$ or $$1 \land 1 = 1$$
2. $$a \lor b = c$$ with solutions $$0 \lor 0 = 0$$ or $$0 \lor 1 = 1$$ or $$1 \lor 0 = 1$$ or $$1 \lor 1 = 1$$

For an input of $$n$$ gates we have $$m$$ starting gates that have non variable left sides of their equations. An example input to a starting gate could be $$1 \land 1 = z$$ with the single solution $$1 \land 1 = 1$$. What we have to do in the combination steps, is to take all equations that only have non variables on the left side to match exactly one of their precomputed solutions. For all starting gates we would take the single solution they have. We then substitute the right side variable with the right side of the solution. In our example we substitute $$z$$ with $$1$$. Whenever we did of round of variable substitution against concrete values, we can iterate again until we substituted all right side variables.

The last variable we substituted is the output of the final gate and gives us the answer to the problem instance.

#### $$P_A$$ can be Horn-SAT

Horn-satisfiability supports *efficient structural combination* for $$k = 3$$. For every Horn clause there is a set of equivalent Horn clauses with three literals each, by applying the following rules:

1. $$A \Leftrightarrow$$ $$(1 \land 1 \implies A)$$
2. $$\lnot A \Leftrightarrow$$ $$(A \land 1 \implies 0)$$
3. $$(A \implies B) \Leftrightarrow$$ $$(A \land 1 \implies B)$$
4. $$(A \land B \land C \implies D) \Leftrightarrow$$ $$(A \land B \implies E), (E \land C \implies D)$$

The principle of the last rule can be applied for any clause with more than three literals, resulting in a set of clauses with three literals each.

Working with clauses of three literals each, we find solutions for every clause by listing the satisfiability for each combination of values on the left side of the implication. So for $$A \land 1 \implies 0$$ we would have $$1 \land 1$$ is unsatisfiable and $$0 \land 1$$ is satisfiable. There will be at most $$2^2$$ solutions to satisfiability for each clause.

The combination starts by checking that each set of solutions to a clause has at least one satisfiable outcome. If true, we collect all variables that are implied by static values, like $$1 \land 1 \implies A$$, then substitute those variables with $$1$$.
We reiterate by checking that each set of solutions has at least one satisfiable outcome. Substituting more variables with $$1$$, will limit the solution sets of clauses that contain substituted variables. So $$A \land B \implies C$$ has a solution set of $$0 \land 0$$, $$0 \land 1$$, $$1 \land 0$$ and $$1 \land 1$$, but $$1 \land B \implies C$$ has a limited solution set of $$1 \land 0$$ and $$1 \land 1$$.
This reduction will either end unsatisfiable if there is some set of solutions that has no satisfiable outcome or end satisfiable if we cannot substitute any more variables with $$1$$.

### Relation to *NP-complete*

If any member of *NP-complete* does not support *efficient structural combination*, then *P* should not equal *NP*.

This follows from *P-complete* being equal to *NP-complete* if *P* is equal to *NP*. Since every member of *P-complete* would support *efficient structural combination*, every member of *NP-complete* should support it, too.

We have to show that no constant $$k$$ can be found for a problem of *NP-complete* and that we will always depend on $$n$$ when trying to combine sub solutions. For example we can easily discover Hamiltonian Paths for problem instances of size $$2n$$, if we already have all sub solutions of size $$n+1$$. We have to look for pairs of solutions where two starting and ending vertices overlap and where the combined amount of unique vertices is $$2n$$.
We could recursively apply the above to sub solutions, but the further we go down in size, the more we need to combine sub solutions and the amount of combinatorial steps will grow exponentially. This approach will not give us polynomial runtime, not even for problems that are known to be in *P*.

### Relation to *P*

Every decision problem in *P* should support *efficient structural combination*.
This should follow from the fact that every decision problem in *P* can be represented by a uniform family of polynomial sized Boolean Circuits and the fact that all of those circuits can be evaluated by using MCVP.

Supporting *efficient structural combination* as an inherent property of decision problems in *P*.
We do not always have to go down to Boolean Circuit representations to get to that property.

2-SAT supports *efficient structural combination* for $$k = 2$$. We take the implicative normal form of each clause. For example $$A \lor B$$ would become $$\lnot A \implies B$$ and $$\lnot B \implies A$$, with solutions $$(A = 0 \land B = 1)\ \lor$$ $$(A = 1 \land B = 0)\ \lor$$ $$(A = 1 \land B = 1)$$.

By transitively combining all implications, we can have two outcomes:

1. There is a literal $$C$$ with two implication chains, one where $$C = 1$$ implies $$\lnot C = 1$$ and one where $$\lnot C = 1$$ implies $$C = 1$$. A contradiction which makes the problem instance unsatisfiable.
2. There is no such literal $$C$$ and the problem instance is satisfiable.

2D Convex Hull supports *efficient structural combination* for $$k = 4$$. The combinatorial part works by counting edge occurrences over all solutions for combinations of four vertices. All edges that are part of the convex hull occur equally often and most importantly more often than any other edges.

TSP Nearest Neighbour Heuristic supports *efficient structural combination* for $$k = 3$$. For every combination of three vertices there are three routes, as we have to include solutions for every starting vertex.

If $$n$$ is $$3$$ and the starting vertex is $$s$$, we just have to pick the solution that starts with $$s$$ from three routes.

If $$n$$ is more than $$3$$ and the starting vertex is $$s$$, we collect all solutions that start with $$s$$. If $$s'$$ is the nearest neighbour of $$s$$, every collected solution that includes $$s'$$ has the structure $$(s,s',*)$$. We can identify $$s'$$, because it appears directly after $$s$$ more often than any other vertex.

We proceed by taking $$s'$$ as new starting vertex to collect all solutions that start with $$s'$$ and don’t include any previous starting vertex.

Here is an example for vertices $$a, b, c, d$$ with the distance relationships $$dist(a,d) < dist(a,b) < dist(a,c)$$ and $$dist(b,a) < dist(b,d) < dist(b,c)$$ and $$dist(c,a) < dist(c,d) < dist(c,b)$$ and $$dist(d,a) < dist(d,b) < dist(d,c)$$. The $$4\choose 3$$ combinations are $$\{a,b,c\}$$, $$\{a,b,d\}$$, $$\{a,c,d\}$$ and $$\{b,c,d\}$$. The solutions are $$\{(a,b,c),(b,a,c),(c,a,b)\}$$ and $$\{(a,d,b),(b,a,d),(d,a,b)\}$$ and $$\{(a,d,c),(c,a,d),(d,a,c)\}$$ and $$\{(b,d,c),(c,d,b),(d,b,c)\}$$.

To find the solution for $$b$$ as starting vertex, we first collect all solutions that start with $$b$$ and get $$\{(b,a,c),(b,a,d),(b,d,c)\}$$. We see that $$a$$ appears most often directly after $$b$$, so $$a$$ is the nearest neighbour of $$b$$. Because we are left with three vertices now, we have to pick the solution that starts with $$a$$ and doesn’t include $$b$$, which is $$(a,d,c)$$.
The solution thus is $$b \to a \to d \to c \to b$$.

### Shortest Path Problem and Longest Path Problem

Both problems seem very similar, one is like the inverse of the other. We know that the shortest simple path can be found in polynomial time and can show that the problem supports *efficient structural combination*. On the other hand, the longest simple path might not be found in polynomial time, as this decision problem is in *NP-complete*. If the Longest Path Problem supports *efficient structural combination* for simple paths, then *P* does equal *NP* and if it does not support *efficient structural combination* for simple paths, then *P* should not equal *NP*.

The Shortest Path Problem does support *efficient structural combination* for simple paths and $$k = 2$$. We have to work with normalized inputs that only contain edges of the same positive weight $$w$$. The single positive weight $$w$$ could be $$1$$ or $$0.1$$ for example. For each node we list all shortest simple paths that are reachable within one edge. Those paths go through two nodes and have total weight of $$w$$ each.

Assume $$s$$ is our starting node and $$d$$ is our ending node. We need to go over all nodes once, to gather all transitive shortest simple paths. For example, if we have $$s$$ with solutions $$(s \to a, s \to c)$$, we add transitive paths by making $$a$$ and then $$c$$ our new starting node. Let us assume $$a$$ has solutions $$(a \to s, a \to c, a \to d)$$. We add three transitive paths on $$s \to a$$, which would be $$s \to a \to s$$ and $$s \to a \to c$$ and $$s \to a \to d$$. Making $$c$$ our new starting node with assumed solutions $$(c \to s, c \to a, c \to d)$$, we add transitive paths $$s \to c \to s$$ and $$s \to c \to a$$ and $$s \to c \to d$$ and $$s \to a \to c \to s$$ and $$s \to a \to c \to a$$ and $$s \to a \to c \to d$$. Let us assume that the solutions of $$d$$ do not introduce new nodes, making $$d$$ the last starting node. After adding the final transitive paths, we pick the transitive path from $$s$$ to $$d$$ with the least amount of nodes, which would be $$s \to a \to d$$ or $$s \to c \to d$$. For multiple possible solutions, any one solution is as good as any other. By transitively combining paths that start at $$s$$, we get a list of shortest paths to every other node. Without coincidence, the combinatorial part resembles Dijkstra’s algorithm.

Using this approach for the Longest Path Problem for simple paths by picking the longest transitive path instead of the shortest transitive path will only be heuristic and not yield the longest simple path for every problem instance.

### Trying to extend Horn-SAT

We could try to extend Horn-SAT by clauses that include two positive literals, like $$A \implies B \lor C$$. We can add a new combination step to our existing *efficient structural combination* steps, that branches into $$B = 1$$ and into $$C = 1$$. This extended form, which lies between Horn-SAT and 3-SAT, supports *efficient structural combination* until a certain degree. It shows us, that easing problem definition might not abruptly cut off the property of *efficient structural combination*, but gradually.

## Notes

*Efficient structural combination* works with very limited, primitive tools, with symbols and their relationships. With those it combines sub solutions to global solutions. Having all sub solutions, finding a global solution is just like filtering and sorting.

With *efficient structural combination*, listing a maximum of $$n^k$$ combinations can always be done in polynomial time. Each solution to a combination of $$k$$ elements can always be found in polynomial time, even by brute force. This is true for every problem in *NP*. Only the combinatorial part is key to show that a problem is in *P*.

This paper is halfway between science and art. I truly believe that *efficient structural combination* is a powerful tool and even able to draw a line between complexity classes, although I’m not able to strictly proof it yet.
