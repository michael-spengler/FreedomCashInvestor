echo "fellows might want to experiment and provide additional strategies"
read -p "enter strategy name: " strategyName 
git branch -C $strategyName
git checkout $strategyName
git add . && git commit -m "new branch increase-sell-price-strategy-$strategyName"
git push -u origin $strategyName