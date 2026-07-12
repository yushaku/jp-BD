const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11685.658541823355!2d105.832091776704!3d21.03690228749631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba15ec15d17%3A0x620e85c2cfe14d4c!2zTMSDbmcgQ2jhu6cgdOG7i2NoIEjhu5MgQ2jDrSBNaW5o!5e1!3m2!1svi!2s!4v1783745479468!5m2!1svi!2s";

export function ContactMap() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="overflow-hidden rounded-lg">
        <iframe
          src={MAP_EMBED_URL}
          className="aspect-4/3 w-full h-80 border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Vị trí cửa hàng trên Google Maps"
        />
      </div>
    </section>
  );
}
