const randomUsernameArray=['BadKarma', 'casanova', 'HairyPoppins', 'OP_rah', 'Something', 'tinfoilhat', 'anonymouse', 'HeartTicker ', 'YESIMFUNNY', 'Everybody', 'IYELLALOT', 'heyyou', 'aDistraction', 'unfriendme', 'babydoodles', 'fluffycookie', 'ManEatsPants', 'Babushka', 'coolshirtbra', 'kim_chi', 'SaintBroseph', 'chin_chillin', 'iNeed2p', 'fatBatman', 'PaniniHead', 'catsordogs', 'FartnRoses', 'MasterCheif', 'FreeHugz', 'ima.robot', 'pixie_dust', 'ChopSuey', 'B.Juice', 'LtDansLegs', 'garythesnail', 'CountSwagula', 'SweetP', 'Nuggetz', 'fartoolong', 'UFO_believer', 'ihazquestion', 'It’s_A', 'just_a_teen', 'GawdOfROFLS', '2_lft_feet', 'Schmoople', 'LOWERCASE', 'Unnecessary', 'DroolingOnU', 'ironmansnap', 'severusvape', 'MelonSmasher', 'potatoxchipz', 'WustacheMax', 'OneTonSoup', 'HoneyLemon', 'LoveMeKnot', 'takenbyWine', 'taking0ver', 'Unic0rns', 'behind_you', 'TeaBaggins', 'kiss-my-axe', 'AirisWindy', 'cheeseinabag', 'MakunaHatata', 'churros4eva', 'iblamejordan', 'Technophyle', 'peap0ds', 'BabyBluez', 'BarbieBreath', 'MangoGoGo', 'DirtBag', 'FurReal', 'ScoobyCute', 'TheAfterLife', 'WakeAwake', 'Coronacosmo', 'notmuchtoit', 'drunkbetch', 'Calzone_Zone', 'Adobo_Ahai', 'Not-Insync', 'LizzosFlute', 'toastcrunch', 'fizzysodas', 'kokonuts']

const generateRandomUsername=()=>{
const rand=Math.floor(Math.random()*randomUsernameArray.length)
const randomUsername=randomUsernameArray[rand]
if(!randomUsername){
return "RandomUsername"}
return randomUsername
}
