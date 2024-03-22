# yun-feng-assignment2

What were some challenges you faced while making this app?

Given more time, what additional features, functional or design changes would you make?

What assumptions did you make while working on this assignment?

How long did this assignment take to complete?


Clustered Setup

The approach for the "Clusterize" feature in the Conway's Game of Life implementation focuses on creating clusters of live cells around specific points (centers) on the grid. The goal is to initialize the grid in such a way that while only 5-10% of the grid is alive, those live cells are more likely to be clustered together rather than being randomly distributed. This approach simulates more natural patterns and can lead to more interesting simulations. Here's a detailed breakdown of how the clustering is achieved:

1. Generate Empty Grid
First, an empty grid is generated where all cells are initially set to be dead (0). This provides a clean slate for creating the clusters.

2. Select Cluster Centers
Randomly select a number of points on the grid to act as the centers of the clusters. The number of cluster centers (clusterCount) can be determined based on the size of the grid and the desired density of live cells. These centers are chosen so that the clusters are spread out across the grid.

3. Determine Cluster Size
For each cluster center, define a radius (clusterRadius) that determines how far from the center the cluster will extend. The size of the radius can influence how dense each cluster is and how much they overlap with each other, if at all.

4. Populate Clusters
For each cluster center, activate cells within its radius to be alive (1) based on a probability threshold. This step involves iterating over each cell within the radius of a center and randomly deciding whether to make it alive. The probability can be adjusted to control the density of the clusters, ensuring that the overall percentage of live cells is within the desired range (5-10% of the grid).

5. Adjust for Desired Density
The density of live cells in each cluster can be adjusted by changing the probability that a cell within a cluster radius will be set to alive. A higher probability results in denser clusters, while a lower probability results in sparser clusters. This adjustment helps in achieving the overall goal of having 5-10% of the grid alive with cells more likely to be close together.
