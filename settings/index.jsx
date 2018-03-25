function mySettings(props) {

  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");
   
  return (
    <Page>
      <Section title={<Text bold align="center">Fields of Gold settings</Text>}> </Section>
         
              <Select
                label={`Preset Background`}
                settingsKey="image"
                options={[
                  {name:"Aquarium", value:"images/aquarium.jpg"},
                  {name:"Leopard", value:"images/leopard.jpg"},
                  {name:"Tropical paradise", value:"images/paradise.jpg"},
                  {name:"Pasture", value:"images/pasture.jpg"},
                  {name:"Sea Sunset", value:"images/seasunset.jpg"},
                  {name:"Sun Beams", value:"images/sunbeams.jpg"}
                 ]}
              /> 
      
      <ImagePicker
          title="Your own Background"
          description="Pick an image to use as your background."
          label="Pick a Background Image"
          sublabel="Background image might take 10-15 seconds to appear"
          settingsKey="customimage"
          imageWidth={ screenHeight }
          imageHeight={ screenWidth }
        />
      
      
      <Slider
        label="Background opacity"
        settingsKey="shade"
        min="0"
        max="1"
        step="0.1"
      />
      
           
       <Section title={<Text bold align="center">Donate!</Text>}>
      
      <Text italic>If you like this clockface and would like to see it further developed as well as other wonderful Ionic apps and faces created, please know - I run on coffee. It's an essential fuel for inspiration and creativity. So feel free to donate so I won't run out of fuel :) Thanks!
         </Text>
      
      <Link source="https://paypal.me/yuriygalanter">YURIY'S COFFEE FUND</Link> 
         
         </Section>    
    
    </Page>
  );
}

registerSettingsPage(mySettings);
        