#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

#define SDA_PIN D6   // GPIO12
#define SCL_PIN D5   // GPIO14

// Thời gian update dữ liệu
#define REPORTING_PERIOD_MS 1000

PulseOximeter pox;
uint32_t tsLastReport = 0;

// Hàm callback khi phát hiện nhịp tim
void onBeatDetected()
{
  Serial.println("Nhịp tim phát hiện!");
}

void setup()
{
  Serial.begin(115200);

  // Khởi tạo I2C với chân SDA, SCL chỉ định
  Wire.begin(SDA_PIN, SCL_PIN);

  Serial.println("Khởi động cảm biến MAX30100...");

  if (!pox.begin()) {
    Serial.println("Lỗi: Không tìm thấy MAX30100. Kiểm tra dây nối!");
    for (;;);
  } else {
    Serial.println("MAX30100 kết nối thành công.");
  }

  // Đăng ký callback khi phát hiện nhịp tim
  pox.setOnBeatDetectedCallback(onBeatDetected);
}

void loop()
{
  // Cập nhật dữ liệu từ cảm biến
  pox.update();

  // In dữ liệu ra mỗi 1 giây
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    Serial.print("Nhịp tim: ");
    Serial.print(pox.getHeartRate());
    Serial.print(" bpm | SpO2: ");
    Serial.print(pox.getSpO2());
    Serial.println(" %");

    tsLastReport = millis();
  }
}
