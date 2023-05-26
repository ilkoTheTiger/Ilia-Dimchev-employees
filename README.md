# Ilia-Dimchev-employees
## Assignment Documentation

### Task overview
1. Data is being loaded through CSV files from the File System, and accepts different date formats.

2. Should there be a NULL date it will be replaced with **Today** upon reading of the CSV file.

3. The program takes the input and initially creates set of all the listed ProjectIDs

4. The set of ProjectIDs is then iterated, during which all the possible pairs are being gathered

5. Should any of the pairs have overlapping period, it's being pushed inside an array of pairs as value of the property with key the ProjectID

6. The object is then cleared from properties without a pair

7. Afterwards, each of those arrays with pairs is being iterated, this time accumulating the time worked together for each pair

8. Once we identify the pair that've spent the most time working together, we gather all of their common projects abd visualize it in a datagrid

9. This process will repeat every time, the provided CSV file changes since the input is a dependency of the useEffect
