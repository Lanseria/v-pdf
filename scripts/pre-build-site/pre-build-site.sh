npm run build:package

npm pack
UI_PACKAGE_NAME=$(ls | grep v-pdf)
tar -xzvf $UI_PACKAGE_NAME
mkdir node_modules/@lanseria/
mv package node_modules/@lanseria/v-pdf
rm $UI_PACKAGE_NAME
