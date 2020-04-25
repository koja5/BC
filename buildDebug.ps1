ng build --environment prod --aot --sourcemaps false --extract-css true 
$time = (Get-Date).ToString("dd_MM_yyyy_H_m")
$day = (Get-Date).ToString("dd_MM_yyyy")
If(!(test-path C:\Users\Aleksandar\Desktop\Koja\Builds\$day))
{
	New-Item -ItemType directory -Path C:\Users\Aleksandar\Desktop\Koja\Builds\$day
}
$dist2 = 'dist_'+ $time
Compress-Archive -Path dist\* -CompressionLevel Fastest -DestinationPath C:\Users\Aleksandar\Desktop\Koja\Builds\$day\$dist2
Read-Host -Prompt "Press Enter to exit"