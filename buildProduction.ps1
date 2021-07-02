ng build --prod --aot
$time = (Get-Date).ToString("dd_MM_yyyy_H_m")
$day = (Get-Date).ToString("dd_MM_yyyy")
If(!(test-path C:\Users\Aleksandar\Desktop\Koja\BCI\Builds\$day))
{
	New-Item -ItemType directory -Path C:\Users\Aleksandar\Desktop\Koja\BCI\Builds\$day
}
$dist2 = 'dist_'+ $time
Compress-Archive -Path dist\* -CompressionLevel Fastest -DestinationPath C:\Users\Aleksandar\Desktop\Koja\BCI\Builds\$day\$dist2
Read-Host -Prompt "Press Enter to exit"